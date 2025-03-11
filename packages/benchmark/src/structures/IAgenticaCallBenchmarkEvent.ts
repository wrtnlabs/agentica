import { AgenticaPrompt, AgenticaTokenUsage } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

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
export type IAgenticaCallBenchmarkEvent<Model extends ILlmSchema.Model> =
  | IAgenticaCallBenchmarkEvent.ISuccess<Model>
  | IAgenticaCallBenchmarkEvent.IFailure<Model>
  | IAgenticaCallBenchmarkEvent.IError<Model>;
export namespace IAgenticaCallBenchmarkEvent {
  /**
   * Success event type.
   *
   * The `success` event type represents that the benchmark
   * testing is fully meet the expected scenario.
   */
  export interface ISuccess<Model extends ILlmSchema.Model>
    extends IEventBase<"success", Model> {
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
  export interface IFailure<Model extends ILlmSchema.Model>
    extends IEventBase<"failure", Model> {
    /**
     * Whether succeeded to function selection.
     */
    select: boolean;

    /**
     * Whether succeeded to function call.
     */
    call: boolean;
  }

  export interface IError<Model extends ILlmSchema.Model>
    extends IEventBase<"error", Model> {
    /**
     * Error occurred during the benchmark.
     */
    error: unknown;
  }

  interface IEventBase<Type extends string, Model extends ILlmSchema.Model> {
    /**
     * Discriminant type.
     */
    type: Type;

    /**
     * Expected scenario.
     */
    scenario: IAgenticaCallBenchmarkScenario<Model>;

    /**
     * Prompt histories.
     *
     * List of prompts occurred during the benchmark testing.
     */
    prompts: AgenticaPrompt<Model>[];

    /**
     * Usage of the token during the benchmark.
     */
    usage: AgenticaTokenUsage;

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
