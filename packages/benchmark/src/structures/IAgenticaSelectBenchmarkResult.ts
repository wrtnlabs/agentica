import { IAgenticaTokenUsage } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaSelectBenchmarkEvent } from "./IAgenticaSelectBenchmarkEvent";
import { IAgenticaSelectBenchmarkScenario } from "./IAgenticaSelectBenchmarkScenario";

/**
 * Result of the LLM function selection benchmark.
 *
 * `IAgenticaSelectBenchmarkResult` is a structure representing the result
 * of the LLM function selection benchmark executed by the
 * {@link AgenticaSelectBenchmark.execute execute} function.
 *
 * It contains every experiment results for each scenario, and aggregated
 * LLM token cost in the benchmark process.
 *
 * In each scenario, as the benchmark program experiments multiple times
 * about a scenario, it will contain multiple events. Also, because of the
 * characteristics of the LLM which is not predictable, the result can be
 * different in each event.
 *
 * @author Samchon
 */
export interface IAgenticaSelectBenchmarkResult<
  Model extends ILlmSchema.Model,
> {
  /**
   * Experiments for each scenario.
   */
  experiments: IAgenticaSelectBenchmarkResult.IExperiment<Model>[];

  /**
   * Aggregated token usage information.
   */
  usage: IAgenticaTokenUsage;

  /**
   * Start time of the benchmark.
   */
  started_at: Date;

  /**
   * End time of the benchmark.
   */
  completed_at: Date;
}
export namespace IAgenticaSelectBenchmarkResult {
  /**
   * Experiment result about a scenario.
   */
  export interface IExperiment<Model extends ILlmSchema.Model> {
    /**
     * Expected scenario.
     */
    scenario: IAgenticaSelectBenchmarkScenario<Model>;

    /**
     * Events occurred during the benchmark in the scenario.
     *
     * When benchmarking a scenario, {@link AgenticaSelectBenchmark} will
     * test a scenario multiple times with the given
     * {@link AgenticaSelectBenchmark.IConfig.repeat repeat} count.
     * And the event is one of the repeated benchmark results.
     */
    events: IAgenticaSelectBenchmarkEvent<Model>[];

    /**
     * LLM token usage information.
     */
    usage: IAgenticaTokenUsage;
  }
}
