import { IAgenticaTokenUsage } from "@agentica/core";

import { IAgenticaCallBenchmarkEvent } from "./IAgenticaCallBenchmarkEvent";
import { IAgenticaCallBenchmarkScenario } from "./IAgenticaCallBenchmarkScenario";

/**
 * Result of the LLM function calling benchmark.
 *
 * `IAgenticaCallBenchmarkResult` is a structure representing the result
 * of the LLM function calling benchmark executed by the
 * {@link AgenticaCallBenchmark.execute execute} function.
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
export interface IAgenticaCallBenchmarkResult {
  /**
   * Experiments for each scenario.
   */
  experiments: IAgenticaCallBenchmarkResult.IExperiment[];

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
export namespace IAgenticaCallBenchmarkResult {
  /**
   * Experiment result about a scenario.
   */
  export interface IExperiment {
    /**
     * Scenario of the experiment.
     */
    scenario: IAgenticaCallBenchmarkScenario;

    /**
     * Events occurred during the benchmark in the scenario.
     *
     * When benchmarking a scenario, {@link AgenticaCallBenchmark} will
     * test a scenario multiple times with the given
     * {@link AgenticaCallBenchmark.IConfig.repeat repeat} count.
     * And the event is one of the repeated benchmark results.
     */
    events: IAgenticaCallBenchmarkEvent[];

    /**
     * LLM token usage information.
     */
    usage: IAgenticaTokenUsage;
  }
}
