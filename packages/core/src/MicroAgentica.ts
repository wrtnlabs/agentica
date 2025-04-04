import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperationCollection } from "./context/AgenticaOperationCollection";
import type { MicroAgenticaContext } from "./context/MicroAgenticaContext";
import type { AgenticaRequestEvent } from "./events/AgenticaRequestEvent";
import type { MicroAgenticaEvent } from "./events/MicroAgenticaEvent";
import type { AgenticaExecutePrompt } from "./prompts/AgenticaExecutePrompt";
import type { AgenticaTextPrompt } from "./prompts/AgenticaTextPrompt";
import type { MicroAgenticaPrompt } from "./prompts/MicroAgenticaPrompt";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";
import type { IMicroAgenticaConfig } from "./structures/IMicroAgenticaConfig";
import type { IMicroAgenticaProps } from "./structures/IMicroAgenticaProps";

import { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";
import { AgenticaOperationComposer } from "./context/internal/AgenticaOperationComposer";
import { AgenticaTokenUsageAggregator } from "./context/internal/AgenticaTokenUsageAggregator";
import { createRequestEvent, createTextEvent } from "./factory/events";
import { createTextPrompt } from "./factory/prompts";
import { call, describe } from "./orchestrate";
import { AgenticaPromptTransformer } from "./transformers/AgenticaPromptTransformer";
import { __map_take } from "./utils/__map_take";
import { ChatGptCompletionMessageUtil } from "./utils/ChatGptCompletionMessageUtil";
import { StreamUtil } from "./utils/StreamUtil";

export class MicroAgentica<Model extends ILlmSchema.Model> {
  private readonly operations_: AgenticaOperationCollection<Model>;
  private readonly histories_: MicroAgenticaPrompt<Model>[];
  private readonly listeners_: Map<string, Set<(event: MicroAgenticaEvent<Model>) => Promise<void>>>;
  private readonly token_usage_: AgenticaTokenUsage;

  /* -----------------------------------------------------------
    CONSTRUCTOR
  ----------------------------------------------------------- */
  public constructor(private readonly props: IMicroAgenticaProps<Model>) {
    this.operations_ = AgenticaOperationComposer.compose({
      controllers: props.controllers,
      config: props.config,
    });
    this.histories_ = (props.histories ?? []).map(input =>
      AgenticaPromptTransformer.transform({
        operations: this.operations_.group,
        prompt: input,
      }),
    ) as MicroAgenticaPrompt<Model>[];
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
  public async conversate(content: string): Promise<MicroAgenticaPrompt<Model>[]> {
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

    const ctx: MicroAgenticaContext<Model> = this.getContext({
      prompt,
      usage: this.token_usage_,
    });
    const histories: MicroAgenticaPrompt<Model>[] = await call(
      ctx,
      this.operations_.array,
    ) as MicroAgenticaPrompt<Model>[];
    const executes: AgenticaExecutePrompt<Model>[] = histories.filter(p => p.type === "execute");
    if (executes.length) {
      histories.push(...await describe(ctx, executes));
    }

    this.histories_.push(prompt, ...histories);
    return histories;
  }

  public getConfig(): IMicroAgenticaConfig<Model> | undefined {
    return this.props.config;
  }

  public getVendor(): IAgenticaVendor {
    return this.props.vendor;
  }

  public getControllers(): ReadonlyArray<IAgenticaController<Model>> {
    return this.props.controllers;
  }

  public getPromptHitorie(): MicroAgenticaPrompt<Model>[] {
    return this.histories_;
  }

  public getTokenUsage(): AgenticaTokenUsage {
    return this.token_usage_;
  }

  public getContext(props: {
    prompt: AgenticaTextPrompt<"user">;
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
