import { Semaphore } from "tstl";

import type { AgenticaContext } from "./context/AgenticaContext";
import type { AgenticaOperation } from "./context/AgenticaOperation";
import type { AgenticaOperationCollection } from "./context/AgenticaOperationCollection";
import type { AgenticaOperationSelection } from "./context/AgenticaOperationSelection";
import type { AgenticaEvent } from "./events/AgenticaEvent";
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
import { createInitializeEvent, createUserMessageEvent } from "./factory/events";
import { execute } from "./orchestrate/execute";
import { transformHistory } from "./transformers/transformHistory";
import { __map_take } from "./utils/__map_take";
import { getChatCompletionFunction } from "./utils/request";

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
export class Agentica {
  // THE OPERATIONS
  private readonly operations_: AgenticaOperationCollection;

  // STACK
  private readonly stack_: AgenticaOperationSelection[];
  private readonly histories_: AgenticaHistory[];
  private readonly listeners_: Map<string, Set<(event: AgenticaEvent) => Promise<void> | void>>;

  // STATUS
  private readonly executor_: (ctx: AgenticaContext) => Promise<void>;
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
  public constructor(private readonly props: IAgenticaProps) {
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
  public clone(): Agentica {
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
  ): Promise<AgenticaHistory[]> {
    const historyGetters: Array<() => Promise<AgenticaHistory>> = [];
    const dispatch = async (event: AgenticaEvent): Promise<void> => {
      try {
        await this.dispatch(event);
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
      }
      catch {}
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
    void dispatch(prompt).catch(() => {});

    await this.executor_(
      this.getContext({
        dispatch,
        prompt: prompt.toHistory(),
        abortSignal: options.abortSignal,
        usage: this.token_usage_,
      }),
    );

    const completed: AgenticaHistory[] = await Promise.all(
      historyGetters.map(async h => h()),
    );
    this.histories_.push(...completed);
    return completed;
  }

  /**
   * Get configuration.
   */
  public getConfig(): IAgenticaConfig | undefined {
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
  public getControllers(): ReadonlyArray<IAgenticaController> {
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
  public getOperations(): ReadonlyArray<AgenticaOperation> {
    return this.operations_.array;
  }

  /**
   * Get the chatbot's histories.
   *
   * Get list of chat histories that the chatbot has been conversated.
   *
   * @returns List of chat histories
   */
  public getHistories(): AgenticaHistory[] {
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
    dispatch: (event: AgenticaEvent) => Promise<void>;
    abortSignal?: AbortSignal;
  }): AgenticaContext {
    const request = getChatCompletionFunction({
      vendor: this.props.vendor,
      config: this.props.config,
      dispatch: props.dispatch,
      abortSignal: props.abortSignal,
      usage: this.token_usage_,
    });

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
        void props.dispatch(createInitializeEvent()).catch(() => {});
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
      event: AgenticaEvent.Mapper[Type],
    ) => void | Promise<void>,
  ): this {
    /**
     * @TODO remove `as`
     */
    __map_take(this.listeners_, type, () => new Set()).add(listener as (event: AgenticaEvent) => void | Promise<void>);
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
      event: AgenticaEvent.Mapper[Type],
    ) => void | Promise<void>,
  ): this {
    const set = this.listeners_.get(type);
    if (set !== undefined) {
    /**
     * @TODO remove `as`
     */
      set.delete(listener as (event: AgenticaEvent) => void | Promise<void>);
      if (set.size === 0) {
        this.listeners_.delete(type);
      }
    }
    return this;
  }

  private async dispatch<Event extends AgenticaEvent>(
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
