import type { IAgenticaTokenUsageJson } from "../json/IAgenticaTokenUsageJson";

import typia from "typia";

export class AgenticaTokenUsage implements IAgenticaTokenUsageJson {
  /**
   * Aggregated token usage.
   */
  public readonly aggregate: AgenticaTokenUsage.IComponent;

  /**
   * Token uasge of initializer agent.
   */
  public readonly initialize: AgenticaTokenUsage.IComponent;

  /**
   * Token usage of function selector agent.
   */
  public readonly select: AgenticaTokenUsage.IComponent;

  /**
   * Token usage of function canceler agent.
   */
  public readonly cancel: AgenticaTokenUsage.IComponent;

  /**
   * Token usage of function caller agent.
   */
  public readonly call: AgenticaTokenUsage.IComponent;

  /**
   * Token usage of function calling describer agent.
   */
  public readonly describe: AgenticaTokenUsage.IComponent;

  public constructor(props?: IAgenticaTokenUsageJson) {
    if (props === undefined) {
      const zero = AgenticaTokenUsage.zero();
      this.aggregate = zero.aggregate;
      this.initialize = zero.initialize;
      this.select = zero.select;
      this.cancel = zero.cancel;
      this.call = zero.call;
      this.describe = zero.describe;
    }
    else {
      this.aggregate = props.aggregate;
      this.initialize = props.initialize;
      this.select = props.select;
      this.cancel = props.cancel;
      this.call = props.call;
      this.describe = props.describe;
    }
  }

  public increment(y: IAgenticaTokenUsageJson): void {
    const increment = (
      x: IAgenticaTokenUsageJson.IComponent,
      y: IAgenticaTokenUsageJson.IComponent,
    ): void => {
      x.total += y.total;
      x.input.total += y.input.total;
      x.input.cached += y.input.cached;
      x.output.total += y.output.total;
      x.output.reasoning += y.output.reasoning;
      x.output.accepted_prediction += y.output.accepted_prediction;
      x.output.rejected_prediction += y.output.rejected_prediction;
    };
    increment(this.aggregate, y.aggregate);
    increment(this.initialize, y.initialize);
    increment(this.select, y.select);
    increment(this.cancel, y.cancel);
    increment(this.call, y.call);
    increment(this.describe, y.describe);
  }

  public toJSON(): IAgenticaTokenUsageJson {
    return typia.misc.clone<IAgenticaTokenUsageJson>(this);
  }

  public static zero(): AgenticaTokenUsage {
    const component = (): IAgenticaTokenUsageJson.IComponent => ({
      total: 0,
      input: {
        total: 0,
        cached: 0,
      },
      output: {
        total: 0,
        reasoning: 0,
        accepted_prediction: 0,
        rejected_prediction: 0,
      },
    });
    return new AgenticaTokenUsage({
      aggregate: component(),
      initialize: component(),
      select: component(),
      cancel: component(),
      call: component(),
      describe: component(),
    });
  }

  public static plus(
    x: AgenticaTokenUsage,
    y: AgenticaTokenUsage,
  ): AgenticaTokenUsage {
    const z: AgenticaTokenUsage = new AgenticaTokenUsage(x);
    z.increment(y.toJSON());
    return z;
  }
}
export namespace AgenticaTokenUsage {
  export interface IComponent {
    /**
     * Total token usage.
     */
    total: number;

    /**
     * Input token usage of detailed.
     */
    input: IInput;

    /**
     * Output token usage of detailed.
     */
    output: IOutput;
  }

  /**
   * Input token usage of detailed.
   */
  export interface IInput {
    /**
     * Total amount of input token uasge.
     */
    total: number;

    /**
     * Cached token usage.
     */
    cached: number;
  }

  /**
   * Output token usage of detailed.
   */
  export interface IOutput {
    /**
     * Total amount of output token usage.
     */
    total: number;

    /**
     * Reasoning token usage.
     */
    reasoning: number;

    /**
     * Prediction token usage.
     */
    accepted_prediction: number;

    /**
     * Rejected prediction token usage.
     */
    rejected_prediction: number;
  }
}
