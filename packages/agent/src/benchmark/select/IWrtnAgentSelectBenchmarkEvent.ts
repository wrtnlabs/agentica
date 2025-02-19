import { IWrtnAgentOperationSelection } from "../../structures/IWrtnAgentOperationSelection";
import { IWrtnAgentTokenUsage } from "../../structures/IWrtnAgentTokenUsage";
import { IWrtnAgentSelectBenchmarkScenario } from "./IWrtnAgentSelectBenchmarkScenario";

/**
 * Event of LLM function selection benchmark.
 *
 * `IWrtnAgentSelectBenchmarkEvent` is an union type of the events occurred
 * during the LLM function selection benchmark, representing one phase of
 * the benchmark testing about a scenario.
 *
 * In other words, when {@link WrtnAgentSelectBenchmark} executes the
 * benchmark, it will run the benchmark will test a scenario repeately with
 * the given configuration {@link WrtnAgentSelectBenchmark.IConfig.repeat}.
 * And in the repeated benchmark about a scenario,
 * `IWrtnAgentSelectBenchmarkEvent` is one of the repeated testing.
 *
 * For reference, `IWrtnAgentSelectBenchmarkEvent` is categorized into three
 * types: `success`, `failure`, and `error`. The `success` means the
 * benchmark testing is fully meet the expected scenario, and `failure`
 * means that the `selector` had not selected the expected operations. The
 * last type, `error`, means that an error had been occurred during the
 * benchmark testing.
 *
 * @author Samchon
 */
export type IWrtnAgentSelectBenchmarkEvent =
  | IWrtnAgentSelectBenchmarkEvent.ISuccess
  | IWrtnAgentSelectBenchmarkEvent.IFailure
  | IWrtnAgentSelectBenchmarkEvent.IError;
export namespace IWrtnAgentSelectBenchmarkEvent {
  /**
   * Success event type.
   *
   * The `success` event type represents that the benchmark testing is
   * fully meet the expected scenario.
   */
  export interface ISuccess extends IEventBase<"success"> {
    /**
     * Usage of the token during the benchmark.
     */
    usage: IWrtnAgentTokenUsage;

    /**
     * Selected operations in the benchmark.
     */
    selected: IWrtnAgentOperationSelection[];
  }

  /**
   * Failure event type.
   *
   * The `failure` event type represents that the `selector` had not
   * selected the expected scenario in the benchmark testing.
   */
  export interface IFailure extends IEventBase<"failure"> {
    /**
     * Usage of the token during the benchmark.
     */
    usage: IWrtnAgentTokenUsage;

    /**
     * Selected operations in the benchmark.
     */
    selected: IWrtnAgentOperationSelection[];
  }

  export interface IError extends IEventBase<"error"> {
    /**
     * Error occurred during the benchmark.
     */
    error: unknown;
  }

  interface IEventBase<Type extends string> {
    /**
     * Discriminant type.
     */
    type: Type;

    /**
     * Expected scenario.
     */
    scenario: IWrtnAgentSelectBenchmarkScenario;

    /**
     * When the benchmark testing started.
     */
    started_at: Date;

    /**
     * When the benchmark testing completed.
     */
    completed_at: Date;
  }
}
