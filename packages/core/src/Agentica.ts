import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "./context/AgenticaContext";
import type { AgenticaOperation } from "./context/AgenticaOperation";
import type { AgenticaOperationCollection } from "./context/AgenticaOperationCollection";
import type { AgenticaOperationSelection } from "./context/AgenticaOperationSelection";
import type { AgenticaEvent } from "./events/AgenticaEvent";
import type { AgenticaRequestEvent } from "./events/AgenticaRequestEvent";
import type { AgenticaPrompt } from "./prompts/AgenticaPrompt";
import type { AgenticaTextPrompt } from "./prompts/AgenticaTextPrompt";
import type { IAgenticaConfig } from "./structures/IAgenticaConfig";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { IAgenticaProps } from "./structures/IAgenticaProps";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";

import { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";
import { AgenticaOperationComposer } from "./context/internal/AgenticaOperationComposer";
import { AgenticaTokenUsageAggregator } from "./context/internal/AgenticaTokenUsageAggregator";
import { createInitializeEvent, createRequestEvent, createTextEvent } from "./factory/events";
import { createTextPrompt } from "./factory/prompts";
import { execute } from "./orchestrate/execute";
import { AgenticaPromptTransformer } from "./transformers/AgenticaPromptTransformer";
import { __map_take } from "./utils/__map_take";
import { ChatGptCompletionMessageUtil } from "./utils/ChatGptCompletionMessageUtil";
import { StreamUtil } from "./utils/StreamUtil";

/**
 * Nestia A.I. chatbot agent.
 *
 * `Agentica` is a facade class for the super A.I. chatbot agent
 * which performs the {@link conversate user's conversation function}
 * with LLM (Large Language Model) function calling and manages the
 * {@link getPromptHistories prompt histories}.
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
 *   - {@link IAgenticaPromptJson}
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
  private readonly prompt_histories_: AgenticaPrompt<Model>[];
  private readonly listeners_: Map<string, Set<(event: AgenticaEvent<Model>) => Promise<void> | void>>;

  // STATUS
  private readonly token_usage_: AgenticaTokenUsage;
  private ready_: boolean;
  private readonly executor_: (
    ctx: AgenticaContext<Model>,
  ) => Promise<AgenticaPrompt<Model>[]>;

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

    // STATUS
    this.stack_ = [];
    this.listeners_ = new Map();
    this.prompt_histories_ = (props.histories ?? []).map(input =>
      AgenticaPromptTransformer.transform({
        operations: this.operations_.group,
        prompt: input,
      }),
    );

    // STATUS
    this.token_usage_ = AgenticaTokenUsage.zero();
    this.ready_ = false;
    this.executor_
      = typeof props.config?.executor === "function"
        ? props.config.executor
        : execute(props.config?.executor ?? null);
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
   * Conversate with the A.I. chatbot.
   *
   * User talks to the A.I. chatbot with the content.
   *
   * When the user's conversation implies the A.I. chatbot to execute a
   * function calling, the returned chat prompts will contain the
   * function calling information like {@link IAgenticaPromptJson.IExecute}.
   *
   * @param content The content to talk
   * @returns List of newly created chat prompts
   */
  public async conversate(content: string): Promise<AgenticaPrompt<Model>[]> {
    const prompt: AgenticaTextPrompt<"user"> = createTextPrompt<"user">({
      role: "user",
      text: content,
    });
    await this.dispatch(
      createTextEvent({
        role: "user",
        stream: StreamUtil.to(content),
        done: () => true,
        get: () => content,
        join: async () => Promise.resolve(content),
      }),
    );

    const newbie: AgenticaPrompt<Model>[] = await this.executor_(
      this.getContext({
        prompt,
        usage: this.token_usage_,
      }),
    );
    this.prompt_histories_.push(prompt, ...newbie);
    return [prompt, ...newbie];
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
   * the "Super A.I. Chatbot" can execute.
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
   * Get the chatbot's prompt histories.
   *
   * Get list of chat prompts that the chatbot has been conversated.
   *
   * @returns List of chat prompts
   */
  public getPromptHistories(): AgenticaPrompt<Model>[] {
    return this.prompt_histories_;
  }

  /**
   * Get token usage of the A.I. chatbot.
   *
   * Entire token usage of the A.I. chatbot during the conversating
   * with the user by {@link conversate} method callings.
   *
   * @returns Cost of the A.I. chatbot
   */
  public getTokenUsage(): AgenticaTokenUsage {
    return this.token_usage_;
  }

  /**
   * @internal
   */
  public getContext(props: {
    prompt: AgenticaTextPrompt<"user">;
    usage: AgenticaTokenUsage;
  }): AgenticaContext<Model> {
    const dispatch = async (event: AgenticaEvent<Model>) => this.dispatch(event);
    return {
      // APPLICATION
      operations: this.operations_,
      config: this.props.config,

      // STATES
      histories: this.prompt_histories_,
      stack: this.stack_,
      ready: () => this.ready_,
      prompt: props.prompt,

      // HANDLERS
      dispatch: async event => this.dispatch(event),
      request: async (source, body) => {
        // request information
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
          options: this.props.vendor.options,
        });
        await dispatch(event);

        // completion
        const completion = await this.props.vendor.api.chat.completions.create(
          event.body,
          event.options,
        );

        const [streamForEvent, temporaryStream] = StreamUtil.transform(
          completion.toReadableStream() as ReadableStream<Uint8Array>,
          value =>
            ChatGptCompletionMessageUtil.transformCompletionChunk(value),
        ).tee();

        const [streamForAggregate, streamForReturn] = temporaryStream.tee();

        void (async () => {
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
        })();

        const [streamForStream, streamForJoin] = streamForEvent.tee();
        await dispatch({
          type: "response",
          source,
          stream: streamForStream,
          body: event.body,
          options: event.options,
          join: async () => {
            const chunks = await StreamUtil.readAll(streamForJoin);
            return ChatGptCompletionMessageUtil.merge(chunks);
          },
        });

        return streamForReturn;
      },
      initialize: async () => {
        this.ready_ = true;
        await dispatch(createInitializeEvent());
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
