/**
 * @module
 * This file contains the implementation of the IAgenticaSelectBenchmarkEvent class.
 *
 * @author Wrtn Technologies
 */
import type {
  AgenticaOperationSelection,
  AgenticaTextHistory,
  AgenticaTokenUsage,
} from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaSelectBenchmarkScenario } from "./IAgenticaSelectBenchmarkScenario";

/**
 * Event of LLM function selection benchmark.
 *
 * `IAgenticaSelectBenchmarkEvent` is an union type of the events occurred
 * during the LLM function selection benchmark, representing one phase of
 * the benchmark testing about a scenario.
 *
 * In other words, when {@link AgenticaSelectBenchmark} executes the
 * benchmark, it will run the benchmark will test a scenario repeately with
 * the given configuration {@link AgenticaSelectBenchmark.IConfig.repeat}.
 * And in the repeated benchmark about a scenario,
 * `IAgenticaSelectBenchmarkEvent` is one of the repeated testing.
 *
 * For reference, `IAgenticaSelectBenchmarkEvent` is categorized into three
 * types: `success`, `failure`, and `error`. The `success` means the
 * benchmark testing is fully meet the expected scenario, and `failure`
 * means that the `selector` had not selected the expected operations. The
 * last type, `error`, means that an error had been occurred during the
 * benchmark testing.
 *
 * @author Samchon
 */
export type IAgenticaSelectBenchmarkEvent<Model extends ILlmSchema.Model> =
  | IAgenticaSelectBenchmarkEvent.ISuccess<Model>
  | IAgenticaSelectBenchmarkEvent.IFailure<Model>
  | IAgenticaSelectBenchmarkEvent.IError<Model>;
export namespace IAgenticaSelectBenchmarkEvent {
  /**
   * Success event type.
   *
   * The `success` event type represents that the benchmark testing is
   * fully meet the expected scenario.
   */
  export interface ISuccess<Model extends ILlmSchema.Model>
    extends IEventBase<"success", Model> {
    /**
     * Usage of the token during the benchmark.
     */
    usage: AgenticaTokenUsage;

    /**
     * Selected operations in the benchmark.
     */
    selected: AgenticaOperationSelection<Model>[];

    /**
     * Prompt messages from the assistant.
     */
    assistantPrompts: AgenticaTextHistory<"assistant">[];
  }

  /**
   * Failure event type.
   *
   * The `failure` event type represents that the `selector` had not
   * selected the expected scenario in the benchmark testing.
   */
  export interface IFailure<Model extends ILlmSchema.Model>
    extends IEventBase<"failure", Model> {
    /**
     * Usage of the token during the benchmark.
     */
    usage: AgenticaTokenUsage;

    /**
     * Selected operations in the benchmark.
     */
    selected: AgenticaOperationSelection<Model>[];

    /**
     * Prompt messages from the assistant.
     */
    assistantPrompts: AgenticaTextHistory<"assistant">[];
  }

  /**
   * Error event type.
   *
   * The `error` event type repsents that an error had been occurred
   * during the benchmark testing.
   */
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
    scenario: IAgenticaSelectBenchmarkScenario<Model>;

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
