import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperationCollection } from "./context/AgenticaOperationCollection";
import type { MicroAgenticaPrompt } from "./prompts/MicroAgenticaPrompt";
import type { MicroAgenticaEvent } from "./events/MicroAgenticaEvent";
import type { IMicroAgenticaProps } from "./structures/IMicroAgenticaProps";
import type { IAgenticaConfig } from "./structures/IAgenticaConfig";
import type { IAgenticaVendor } from "./structures/IAgenticaVendor";
import type { IAgenticaController } from "./structures/IAgenticaController";
import type { AgenticaTokenUsage } from "./context/AgenticaTokenUsage";

export class MicroAgentica<Model extends ILlmSchema.Model> {
  private readonly operations_: AgenticaOperationCollection<Model>;
  private readonly histories_: MicroAgenticaPrompt<Model>[];
  private readonly listeners_: Map<string, Set<(event: MicroAgenticaEvent<Model>) => Promise<void>>>;

  public constructor(private readonly props: IMicroAgenticaProps<Model>) {}

  public async conversate(content: string): Promise<MicroAgenticaPrompt<Model>[]> {

  }

  public getConfig(): IAgenticaConfig<Model> | undefined {
    return this.props.config;
  }

  public getVendor(): IAgenticaVendor {}

  public getControllers(): ReadonlyArray<IAgenticaController<Model>> {}

  public getTokenUsage(): AgenticaTokenUsage {}

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
      set.delete(listener as (event: MicroAgenticaEvent<Model>) => void | Promise<void>);
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
