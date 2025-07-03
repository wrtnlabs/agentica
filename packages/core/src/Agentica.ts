import type { ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import { Semaphore } from "tstl";
import { v4 } from "uuid";

import type { AgenticaContext } from "./context/AgenticaContext";
import type { AgenticaOperation } from "./context/AgenticaOperation";
import type { AgenticaOperationCollection } from "./context/AgenticaOperationCollection";
import type { AgenticaOperationSelection } from "./context/AgenticaOperationSelection";
import type { AgenticaEventSource } from "./events";
import type { AgenticaEvent } from "./events/AgenticaEvent";
import type { AgenticaRequestEvent } from "./events/AgenticaRequestEvent";
import type { AgenticaUserMessageEvent } from "./events/AgenticaUserMessageEvent";
import type { AgenticaUserMessageContent } from "./histories";
import type { AgenticaHistory } from "./histories/AgenticaHistory";
import type { AgenticaUserMessageHistory } from "./histories/AgenticaUserMessageHistory";
import type { IAgenticaConfig } from "./structures/IAgenticaConfig";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { IAgenticaProps } from "./structures/IAgenticaProps";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";

import { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";
import { AgenticaOperationComposer } from "./context/internal/AgenticaOperationComposer";
import { AgenticaTokenUsageAggregator } from "./context/internal/AgenticaTokenUsageAggregator";
import { createInitializeEvent, createRequestEvent, createUserMessageEvent } from "./factory/events";
import { execute } from "./orchestrate/execute";
import { transformHistory } from "./transformers/transformHistory";
import { __map_take } from "./utils/__map_take";
import { ChatGptCompletionMessageUtil } from "./utils/ChatGptCompletionMessageUtil";
import { streamDefaultReaderToAsyncGenerator, StreamUtil } from "./utils/StreamUtil";

/**
 * Agentica AI chatbot agent.
 *
 * `Agentica` is a facade class for the super AI chatbot agent
 * which performs LLM (Large Language Model) function calling from the
 * {@link conversate user's conversation}, and manages the
 * {@link getHistories prompt histories}.
 *
 * To understand and compose the `Agentica` class exactly, reference
 * below types concentrating on the documentation comments please.
 * Especially, you have to be careful about the {@link IAgenticaProps}
 * type which is used in the {@link constructor} function.
 *
 * - Constructors
 *   - {@link IAgenticaProps}
 *   - {@link IAgenticaVendor}
 *   - {@link IAgenticaController}
 *   - {@link IAgenticaConfig}
 *   - {@link IAgenticaSystemPrompt}
 * - Accessors
 *   - {@link IAgenticaOperation}
 *   - {@link IAgenticaHistoryJson}
 *   - {@link IAgenticaEventJson}
 *   - {@link IAgenticaTokenUsageJson}
 *
 * @author Samchon
 */
export class Agentica<Model extends ILlmSchema.Model> {
  // THE OPERATIONS
  private readonly operations_: AgenticaOperationCollection<Model>;

  // STACK
  private readonly stack_: AgenticaOperationSelection<Model>[];
  private readonly histories_: AgenticaHistory<Model>[];
  private readonly listeners_: Map<string, Set<(event: AgenticaEvent<Model>) => Promise<void> | void>>;

  // STATUS
  private readonly executor_: (ctx: AgenticaContext<Model>) => Promise<void>;
  private readonly semaphore_: Semaphore | null;
  private readonly token_usage_: AgenticaTokenUsage;
  private ready_: boolean;

  /* -----------------------------------------------------------
    CONSTRUCTOR
  ----------------------------------------------------------- */
  /**
   * Initializer constructor.
   *
   * @param props Properties to construct the agent
   */
  public constructor(private readonly props: IAgenticaProps<Model>) {
    // OPERATIONS
    this.operations_ = AgenticaOperationComposer.compose({
      controllers: props.controllers,
      config: props.config,
    });

    // STACK
    this.stack_ = [];
    this.listeners_ = new Map();
    this.histories_ = (props.histories ?? []).map(input =>
      transformHistory({
        operations: this.operations_.group,
        history: input,
      }),
    );

    // STATUS
    this.executor_
      = typeof props.config?.executor === "function"
        ? props.config.executor
        : execute(props.config?.executor ?? null);
    this.semaphore_ = props.vendor.semaphore != null
      ? typeof props.vendor.semaphore === "object"
        ? props.vendor.semaphore
        : new Semaphore(props.vendor.semaphore)
      : null;
    this.token_usage_ = this.props.tokenUsage !== undefined
      ? this.props.tokenUsage instanceof AgenticaTokenUsage
        ? this.props.tokenUsage
        : new AgenticaTokenUsage(this.props.tokenUsage)
      : AgenticaTokenUsage.zero();
    this.ready_ = false;
  }

  /**
   * @internal
   */
  public clone(): Agentica<Model> {
    return new Agentica({
      ...this.props,
      histories: this.props.histories?.slice(),
    });
  }

  /* -----------------------------------------------------------
    ACCESSORS
  ----------------------------------------------------------- */
  /**
   * Conversate with the AI chatbot.
   *
   * User talks to the AI chatbot with the given content.
   *
   * When the user's conversation implies the AI chatbot to execute a
   * function calling, the returned chat prompts will contain the
   * function calling information like {@link AgenticaExecuteHistory}.
   *
   * @param content The content to talk
   * @param options Options
   * @param options.abortSignal Abort signal
   * @throws AbortError
   * @returns List of newly created chat prompts
   */
  public async conversate(
    content: string | AgenticaUserMessageContent | Array<AgenticaUserMessageContent>,
    options: {
      abortSignal?: AbortSignal;
    } = {},
  ): Promise<AgenticaHistory<Model>[]> {
    const historyGetters: Array<() => Promise<AgenticaHistory<Model>>> = [];
    const dispatch = (event: AgenticaEvent<Model>): void => {
      this.dispatch(event).catch(() => {});
      if ("toHistory" in event) {
        if ("join" in event) {
          historyGetters.push(async () => {
            await event.join();
            return event.toHistory();
          });
        }
        else {
          historyGetters.push(async () => event.toHistory());
        }
      }
    };

    const prompt: AgenticaUserMessageEvent = createUserMessageEvent({
      contents: Array.isArray(content)
        ? content
        : typeof content === "string"
          ? [{
              type: "text",
              text: content,
            }]
          : [content],
    });
    dispatch(prompt);

    await this.executor_(
      this.getContext({
        dispatch,
        prompt: prompt.toHistory(),
        abortSignal: options.abortSignal,
        usage: this.token_usage_,
      }),
    );

    const completed: AgenticaHistory<Model>[] = await Promise.all(
      historyGetters.map(async h => h()),
    );
    this.histories_.push(...completed);
    return completed;
  }

  /**
   * Get configuration.
   */
  public getConfig(): IAgenticaConfig<Model> | undefined {
    return this.props.config;
  }

  /**
   * Get LLM vendor.
   */
  public getVendor(): IAgenticaVendor {
    return this.props.vendor;
  }

  /**
   * Get controllers.
   *
   * Get list of controllers, which are the collection of functions that
   * the "Super AI Chatbot" can execute.
   */
  public getControllers(): ReadonlyArray<IAgenticaController<Model>> {
    return this.props.controllers;
  }

  /**
   * Get operations.
   *
   * Get list of operations, which has capsuled the pair of controller
   * and function from the {@link getControllers controllers}.
   *
   * @returns List of operations
   */
  public getOperations(): ReadonlyArray<AgenticaOperation<Model>> {
    return this.operations_.array;
  }

  /**
   * Get the chatbot's histories.
   *
   * Get list of chat histories that the chatbot has been conversated.
   *
   * @returns List of chat histories
   */
  public getHistories(): AgenticaHistory<Model>[] {
    return this.histories_;
  }

  /**
   * Get token usage of the AI chatbot.
   *
   * Entire token usage of the AI chatbot during the conversating
   * with the user by {@link conversate} method callings.
   *
   * @returns Cost of the AI chatbot
   */
  public getTokenUsage(): AgenticaTokenUsage {
    return this.token_usage_;
  }

  /**
   * @internal
   */
  public getContext(props: {
    prompt: AgenticaUserMessageHistory;
    usage: AgenticaTokenUsage;
    dispatch: (event: AgenticaEvent<Model>) => void;
    abortSignal?: AbortSignal;
  }): AgenticaContext<Model> {
    const request = async (
      source: AgenticaEventSource,
      body: Omit<OpenAI.ChatCompletionCreateParamsStreaming, "model" | "stream">,
    ): Promise<ReadableStream<OpenAI.Chat.Completions.ChatCompletionChunk>> => {
      const event: AgenticaRequestEvent = createRequestEvent({
        source,
        body: {
          ...body,
          model: this.props.vendor.model,
          stream: true,
          stream_options: {
            include_usage: true,
          },
        },
        options: {
          ...this.props.vendor.options,
          signal: props.abortSignal,
        },
      });
      props.dispatch(event);

      // completion
      const backoffStrategy = this.props.config?.backoffStrategy ?? ((props) => {
        throw props.error;
      });
      const completion = await (async () => {
        let count = 0;
        while (true) {
          try {
            return await this.props.vendor.api.chat.completions.create(
              event.body,
              event.options,
            );
          }
          catch (error) {
            const waiting = backoffStrategy({ count, error });
            await new Promise(resolve => setTimeout(resolve, waiting));
            count++;
          }
        }
      })();

      const [streamForEvent, temporaryStream] = StreamUtil.transform(
        completion.toReadableStream() as ReadableStream<Uint8Array>,
        value =>
          ChatGptCompletionMessageUtil.transformCompletionChunk(value),
      ).tee();

      const [streamForAggregate, streamForReturn] = temporaryStream.tee();

      (async () => {
        const reader = streamForAggregate.getReader();
        while (true) {
          const chunk = await reader.read();
          if (chunk.done) {
            break;
          }
          if (chunk.value.usage != null) {
            AgenticaTokenUsageAggregator.aggregate({
              kind: source,
              completionUsage: chunk.value.usage,
              usage: props.usage,
            });
          }
        }
      })().catch(() => {});

      const [streamForStream, streamForJoin] = streamForEvent.tee();
      props.dispatch({
        id: v4(),
        type: "response",
        source,
        stream: streamDefaultReaderToAsyncGenerator(streamForStream.getReader()),
        body: event.body,
        options: event.options,
        join: async () => {
          const chunks = await StreamUtil.readAll(streamForJoin);
          return ChatGptCompletionMessageUtil.merge(chunks);
        },
        created_at: new Date().toISOString(),
      });
      return streamForReturn;
    };

    return {
      // APPLICATION
      operations: this.operations_,
      config: this.props.config,

      // STATES
      histories: this.histories_,
      stack: this.stack_,
      ready: () => this.ready_,
      prompt: props.prompt,
      abortSignal: props.abortSignal,

      // HANDLERS
      dispatch: props.dispatch,
      request: this.semaphore_ === null
        ? request
        : async (source, body) => {
          await this.semaphore_!.acquire();
          try {
            return await request(source, body);
          }
          finally {
            void this.semaphore_!.release().catch(() => {});
          }
        },
      initialize: async () => {
        this.ready_ = true;
        props.dispatch(createInitializeEvent());
      },
    };
  }

  /* -----------------------------------------------------------
    EVENT HANDLERS
  ----------------------------------------------------------- */
  /**
   * Add an event listener.
   *
   * Add an event listener to be called whenever the event is emitted.
   *
   * @param type Type of event
   * @param listener Callback function to be called whenever the event is emitted
   */
  public on<Type extends AgenticaEvent.Type>(
    type: Type,
    listener: (
      event: AgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    /**
     * @TODO remove `as`
     */
    __map_take(this.listeners_, type, () => new Set()).add(listener as (event: AgenticaEvent<Model>) => void | Promise<void>);
    return this;
  }

  /**
   * Erase an event listener.
   *
   * Erase an event listener to stop calling the callback function.
   *
   * @param type Type of event
   * @param listener Callback function to erase
   */
  public off<Type extends AgenticaEvent.Type>(
    type: Type,
    listener: (
      event: AgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    const set = this.listeners_.get(type);
    if (set !== undefined) {
    /**
     * @TODO remove `as`
     */
      set.delete(listener as (event: AgenticaEvent<Model>) => void | Promise<void>);
      if (set.size === 0) {
        this.listeners_.delete(type);
      }
    }
    return this;
  }

  private async dispatch<Event extends AgenticaEvent<Model>>(
    event: Event,
  ): Promise<void> {
    const set = this.listeners_.get(event.type);
    if (set !== undefined) {
      await Promise.all(
        Array.from(set).map(async (listener) => {
          try {
            await listener(event);
          }
          catch {
            /* empty */
          }
        }),
      );
    }
  }
}
