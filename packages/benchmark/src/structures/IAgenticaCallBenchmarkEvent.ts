import { IAgenticaPrompt, IAgenticaTokenUsage } from "@agentica/core";

import { IAgenticaCallBenchmarkScenario } from "./IAgenticaCallBenchmarkScenario";

/**
 * Event of LLM function selection benchmark.
 *
 * `IAgenticaCallBenchmarkEvent` is an union type of the events occurred
 * during the LLM function calling benchmark, representing one phase of
 * the benchmark testing about a scenario.
 *
 * In other words, when {@link AgenticaCallBenchmark} executes the
 * benchmark, it will run the benchmark will test a scenario repeately with
 * the given configuration {@link AgenticaCallBenchmark.IConfig.repeat}.
 * And in the repeated benchmark about a scenario,
 * `IAgenticaCallBenchmarkEvent` is one of the repeated testing.
 *
 * For reference, `IAgenticaCallBenchmarkEvent` is categorized into three
 * types: `success`, `failure`, and `error`. The `success` means the
 * benchmark testing is fully meet the expected scenario, and `failure`
 * means that the `selector` or `caller` agents had not selected or
 * called the expected operations. The last type, `error`, means that
 * an error had been occurred during the benchmark testing.
 *
 * @author Samchon
 */
export type IAgenticaCallBenchmarkEvent =
  | IAgenticaCallBenchmarkEvent.ISuccess
  | IAgenticaCallBenchmarkEvent.IFailure
  | IAgenticaCallBenchmarkEvent.IError;
export namespace IAgenticaCallBenchmarkEvent {
  /**
   * Success event type.
   *
   * The `success` event type represents that the benchmark
   * testing is fully meet the expected scenario.
   */
  export interface ISuccess extends IEventBase<"success"> {
    /**
     * Whether succeeded to function selection.
     */
    select: true;

    /**
     * Whether succeeded to function call.
     */
    call: true;
  }

  /**
   * Failure event type.
   *
   * The `failure` event type represents that the `selector`
   * or `caller` agents have not selected or called following the
   * expected scenario in the benchmark testing.
   */
  export interface IFailure extends IEventBase<"failure"> {
    /**
     * Whether succeeded to function selection.
     */
    select: boolean;

    /**
     * Whether succeeded to function call.
     */
    call: boolean;
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
    scenario: IAgenticaCallBenchmarkScenario;

    /**
     * Prompt histories.
     *
     * List of prompts occurred during the benchmark testing.
     */
    prompts: IAgenticaPrompt[];

    /**
     * Usage of the token during the benchmark.
     */
    usage: IAgenticaTokenUsage;

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
