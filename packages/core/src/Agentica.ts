import { ILlmSchema } from "@samchon/openapi";

import { ChatGptAgent } from "./chatgpt/ChatGptAgent";
import { ChatGptCompletionMessageUtil } from "./chatgpt/ChatGptCompletionMessageUtil";
import { AgenticaOperationComposer } from "./internal/AgenticaOperationComposer";
import { AgenticaPromptTransformer } from "./internal/AgenticaPromptTransformer";
import { AgenticaTokenUsageAggregator } from "./internal/AgenticaTokenUsageAggregator";
import { StreamUtil } from "./internal/StreamUtil";
import { __map_take } from "./internal/__map_take";
import { IAgenticaConfig } from "./structures/IAgenticaConfig";
import { IAgenticaContext } from "./structures/IAgenticaContext";
import { IAgenticaController } from "./structures/IAgenticaController";
import { IAgenticaEvent } from "./structures/IAgenticaEvent";
import { IAgenticaOperation } from "./structures/IAgenticaOperation";
import { IAgenticaOperationCollection } from "./structures/IAgenticaOperationCollection";
import { IAgenticaOperationSelection } from "./structures/IAgenticaOperationSelection";
import { IAgenticaPrompt } from "./structures/IAgenticaPrompt";
import { IAgenticaProps } from "./structures/IAgenticaProps";
import { IAgenticaTokenUsage } from "./structures/IAgenticaTokenUsage";
import { IAgenticaVendor } from "./structures/IAgenticaVendor";

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
 *   - {@link IAgenticaPrompt}
 *   - {@link IAgenticaEvent}
 *   - {@link IAgenticaTokenUsage}
 *
 * @author Samchon
 */
export class Agentica<Model extends ILlmSchema.Model> {
  // THE OPERATIONS
  private readonly operations_: IAgenticaOperationCollection<Model>;

  // STACK
  private readonly stack_: IAgenticaOperationSelection<Model>[];
  private readonly prompt_histories_: IAgenticaPrompt<Model>[];
  private readonly listeners_: Map<string, Set<Function>>;

  // STATUS
  private readonly token_usage_: IAgenticaTokenUsage;
  private ready_: boolean;
  private readonly executor_: (
    ctx: IAgenticaContext<Model>,
  ) => Promise<IAgenticaPrompt<Model>[]>;

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
    this.prompt_histories_ = (props.histories ?? []).map((input) =>
      AgenticaPromptTransformer.transform({
        operations: this.operations_.group,
        input,
      }),
    );

    // STATUS
    this.token_usage_ = AgenticaTokenUsageAggregator.zero();
    this.ready_ = false;
    this.executor_ =
      typeof props.config?.executor === "function"
        ? props.config.executor
        : ChatGptAgent.execute(props.config?.executor ?? null);
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
   * function calling information like {@link IAgenticaPrompt.IExecute}.
   *
   * @param content The content to talk
   * @returns List of newly created chat prompts
   */
  public async conversate(content: string): Promise<IAgenticaPrompt<Model>[]> {
    const prompt: IAgenticaPrompt.IText<"user"> = {
      type: "text",
      role: "user",
      text: content,
    };
    await this.dispatch({
      ...prompt,
      stream: StreamUtil.to(content),
      join: () => Promise.resolve(content),
    });

    const newbie: IAgenticaPrompt<Model>[] = await this.executor_(
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
   * @returns
   */
  public getOperations(): ReadonlyArray<IAgenticaOperation<Model>> {
    return this.operations_.array;
  }

  /**
   * Get the chatbot's prompt histories.
   *
   * Get list of chat prompts that the chatbot has been conversated.
   *
   * @returns List of chat prompts
   */
  public getPromptHistories(): IAgenticaPrompt<Model>[] {
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
  public getTokenUsage(): IAgenticaTokenUsage {
    return this.token_usage_;
  }

  /**
   * @internal
   */
  public getContext(props: {
    prompt: IAgenticaPrompt.IText<"user">;
    usage: IAgenticaTokenUsage;
  }): IAgenticaContext<Model> {
    const dispatch = (event: IAgenticaEvent<Model>) => this.dispatch(event);
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
      dispatch: (event) => this.dispatch(event),
      request: async (kind, body) => {
        // request information
        const event: IAgenticaEvent.IRequest = {
          type: "request",
          source: kind,
          body: {
            ...body,
            model: this.props.vendor.model,
            stream: true,
          },
          options: this.props.vendor.options,
        };
        await dispatch(event);

        // completion
        const completion = await this.props.vendor.api.chat.completions.create(
          event.body,
          event.options,
        );

        const [streamForEvent, temporaryStream] = StreamUtil.transform(
          completion.toReadableStream() as ReadableStream<Uint8Array>,
          (value) =>
            ChatGptCompletionMessageUtil.transformCompletionChunk(value),
        ).tee();

        const [streamForAggregate, streamForReturn] = temporaryStream.tee();

        void (async () => {
          const reader = streamForAggregate.getReader();
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            if (chunk.value.usage) {
              AgenticaTokenUsageAggregator.aggregate({
                kind,
                completionUsage: chunk.value.usage,
                usage: props.usage,
              });
            }
          }
        })();

        await dispatch({
          type: "response",
          source: kind,
          stream: streamForEvent,
          body: event.body,
          options: event.options,
          join: async () => {
            const chunks = await StreamUtil.readAll(streamForEvent);
            return ChatGptCompletionMessageUtil.merge(chunks);
          },
        });

        return streamForReturn;
      },
      initialize: async () => {
        this.ready_ = true;
        await dispatch({
          type: "initialize",
        });
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
  public on<Type extends IAgenticaEvent.Type>(
    type: Type,
    listener: (
      event: IAgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    __map_take(this.listeners_, type, () => new Set()).add(listener);
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
  public off<Type extends IAgenticaEvent.Type>(
    type: Type,
    listener: (
      event: IAgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    const set = this.listeners_.get(type);
    if (set) {
      set.delete(listener);
      if (set.size === 0) this.listeners_.delete(type);
    }
    return this;
  }

  private async dispatch<Event extends IAgenticaEvent<Model>>(
    event: Event,
  ): Promise<void> {
    const set = this.listeners_.get(event.type);
    if (set) {
      await Promise.all(
        Array.from(set).map(async (listener) => {
          try {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            await listener(event);
          } catch {
            /* empty */
          }
        }),
      );
    }
  }
}
