import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperationCollection } from "./context/AgenticaOperationCollection";
import type { MicroAgenticaContext } from "./context/MicroAgenticaContext";
import type { AgenticaRequestEvent } from "./events/AgenticaRequestEvent";
import type { MicroAgenticaEvent } from "./events/MicroAgenticaEvent";
import type { AgenticaExecuteHistory } from "./histories/AgenticaExecuteHistory";
import type { AgenticaTextHistory } from "./histories/AgenticaTextHistory";
import type { MicroAgenticaHistory } from "./histories/MicroAgenticaHistory";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";
import type { IMicroAgenticaConfig } from "./structures/IMicroAgenticaConfig";
import type { IMicroAgenticaProps } from "./structures/IMicroAgenticaProps";

import { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";
import { AgenticaOperationComposer } from "./context/internal/AgenticaOperationComposer";
import { AgenticaTokenUsageAggregator } from "./context/internal/AgenticaTokenUsageAggregator";
import { createRequestEvent, createTextEvent } from "./factory/events";
import { createTextHistory } from "./factory/histories";
import { call, describe } from "./orchestrate";
import { AgenticaHistoryTransformer } from "./transformers/AgenticaHistoryTransformer";
import { __map_take } from "./utils/__map_take";
import { ChatGptCompletionMessageUtil } from "./utils/ChatGptCompletionMessageUtil";
import { streamDefaultReaderToAsyncGenerator, StreamUtil, toAsyncGenerator } from "./utils/StreamUtil";

/**
 * Micro AI chatbot.
 *
 * `MicroAgentica` is a facade class for the micro AI chatbot agent
 * which performs LLM (Large Language Model) function calling from the
 * {@link conversate user's conversation} and manages the
 * {@link getHistories prompt histories}.
 *
 * Different between `MicroAgentica` and {@link Agentica} is that
 * `MicroAgentica` does not have function selecting filter. It directly
 * list up every functions to the agent. Besides, {@link Agentica} has
 * a function selecting mechanism to reduce the number of functions to
 * be listed up to the agent.
 *
 * Therefore, if you have a lot of functions to call, you must not
 * use this `MicroAgentica` class. Use this `MicroAgentica` class only
 * when you have a few functions to call.
 *
 * - [Multi-agent orchestration of `@agentica`](https://wrtnlabs.io/agentica/docs/concepts/function-calling/#orchestration-strategy)
 * - Internal agents of `MicroAgentica`
 *   - executor
 *   - describier
 * - Internal agents of {@link Agentica}
 *   - initializer
 *   - **selector**
 *   - executor
 *   - describer
 *
 * @author Samchon
 */
export class MicroAgentica<Model extends ILlmSchema.Model> {
  private readonly operations_: AgenticaOperationCollection<Model>;
  private readonly histories_: MicroAgenticaHistory<Model>[];
  private readonly listeners_: Map<string, Set<(event: MicroAgenticaEvent<Model>) => Promise<void>>>;
  private readonly token_usage_: AgenticaTokenUsage;

  /* -----------------------------------------------------------
    CONSTRUCTOR
  ----------------------------------------------------------- */
  /**
   * Initializer Constructor.
   *
   * @param props Properties to construct the micro agent
   */
  public constructor(private readonly props: IMicroAgenticaProps<Model>) {
    this.operations_ = AgenticaOperationComposer.compose({
      controllers: props.controllers,
      config: props.config,
    });
    this.histories_ = (props.histories ?? []).map(input =>
      AgenticaHistoryTransformer.transform({
        operations: this.operations_.group,
        history: input,
      }),
    ) as MicroAgenticaHistory<Model>[];
    this.listeners_ = new Map();
    this.token_usage_ = AgenticaTokenUsage.zero();
  }

  /**
   * @internal
   */
  public clone(): MicroAgentica<Model> {
    return new MicroAgentica<Model>({
      ...this.props,
      histories: this.props.histories?.slice(),
    });
  }

  /* -----------------------------------------------------------
    ACCESSORS
  ----------------------------------------------------------- */
  /**
   * Conversate with the micro agent.
   *
   * User talks to the AI chatbot with the given content.
   *
   * When the user's conversation implies the AI chatbot to execute a
   * function calling, the returned chat prompts will contain the
   * function callinng information like {@link AgenticaExecuteHistory}
   *
   * @param content The content to talk
   * @returns List of newly created histories
   */
  public async conversate(content: string): Promise<MicroAgenticaHistory<Model>[]> {
    const talk: AgenticaTextHistory<"user"> = createTextHistory<"user">({
      role: "user",
      text: content,
    });
    this.dispatch(
      createTextEvent({
        role: "user",
        stream: toAsyncGenerator(content),
        done: () => true,
        get: () => content,
        join: async () => Promise.resolve(content),
      }),
    ).catch(() => {});

    const ctx: MicroAgenticaContext<Model> = this.getContext({
      prompt: talk,
      usage: this.token_usage_,
    });
    const histories: MicroAgenticaHistory<Model>[] = await call(
      ctx,
      this.operations_.array,
    ) as MicroAgenticaHistory<Model>[];
    const executes: AgenticaExecuteHistory<Model>[] = histories.filter(p => p.type === "execute");
    if (executes.length
      && ctx.config?.executor?.describe !== null
      && ctx.config?.executor?.describe !== false) {
      histories.push(...await describe(ctx, executes));
    }

    this.histories_.push(talk, ...histories);
    return histories;
  }

  /**
   * Get configuration.
   */
  public getConfig(): IMicroAgenticaConfig<Model> | undefined {
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
   * the agent can execute.
   */
  public getControllers(): ReadonlyArray<IAgenticaController<Model>> {
    return this.props.controllers;
  }

  /**
   * Get the chatbot's histories.
   *
   * Get list of chat histories that the chatbot has been conversated.
   *
   * @returns List of chat histories
   */
  public getHistories(): MicroAgenticaHistory<Model>[] {
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
    prompt: AgenticaTextHistory<"user">;
    usage: AgenticaTokenUsage;
  }): MicroAgenticaContext<Model> {
    const dispatch = this.dispatch.bind(this);
    return {
      operations: this.operations_,
      config: this.props.config,

      histories: this.histories_,
      prompt: props.prompt,
      dispatch,
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
          stream: streamDefaultReaderToAsyncGenerator(streamForStream.getReader()),
          body: event.body,
          options: event.options,
          join: async () => {
            const chunks = await StreamUtil.readAll(streamForJoin);
            return ChatGptCompletionMessageUtil.merge(chunks);
          },
        });

        return streamForReturn;
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
  public on<Type extends MicroAgenticaEvent.Type>(
    type: Type,
    listener: (
      event: MicroAgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    /**
     * @TODO remove `as`
     */
    __map_take(this.listeners_, type, () => new Set()).add(listener as (event: MicroAgenticaEvent<Model>) => Promise<void>);
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
  public off<Type extends MicroAgenticaEvent.Type>(
    type: Type,
    listener: (
      event: MicroAgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    const set = this.listeners_.get(type);
    if (set !== undefined) {
      /**
       * @TODO remove `as`
       */
      set.delete(listener as (event: MicroAgenticaEvent<Model>) => Promise<void>);
      if (set.size === 0) {
        this.listeners_.delete(type);
      }
    }
    return this;
  }

  private async dispatch<Event extends MicroAgenticaEvent<Model>>(
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
