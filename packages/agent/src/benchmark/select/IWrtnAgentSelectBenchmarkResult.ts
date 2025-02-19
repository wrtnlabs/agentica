import { IWrtnAgentTokenUsage } from "../../structures/IWrtnAgentTokenUsage";
import { IWrtnAgentSelectBenchmarkEvent } from "./IWrtnAgentSelectBenchmarkEvent";
import { IWrtnAgentSelectBenchmarkScenario } from "./IWrtnAgentSelectBenchmarkScenario";

/**
 * Result of the LLM function selection benchmark.
 *
 * `IWrtnAgentSelectBenchmarkResult` is a structure representing the result
 * of the LLM function selection benchmark executed by the
 * {@link WrtnAgentSelectBenchmark.execute execute} function.
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
export interface IWrtnAgentSelectBenchmarkResult {
  /**
   * Experiments for each scenario.
   */
  experiments: IWrtnAgentSelectBenchmarkResult.IExperiment[];

  /**
   * Aggregated token usage information.
   */
  usage: IWrtnAgentTokenUsage;

  /**
   * Start time of the benchmark.
   */
  started_at: Date;

  /**
   * End time of the benchmark.
   */
  completed_at: Date;
}
export namespace IWrtnAgentSelectBenchmarkResult {
  /**
   * Experiment result about a scenario.
   */
  export interface IExperiment {
    /**
     * Expected scenario.
     */
    scenario: IWrtnAgentSelectBenchmarkScenario;

    /**
     * Events occurred during the benchmark in the scenario.
     *
     * When benchmarking a scenario, {@link WrtnAgentSelectBenchmark} will
     * test a scenario multiple times with the given
     * {@link WrtnAgentSelectBenchmark.IConfig.repeat repeat} count. And
     * the event is one of the repeated benchmark results.
     */
    events: IWrtnAgentSelectBenchmarkEvent[];

    /**
     * LLM token usage information.
     */
    usage: IWrtnAgentTokenUsage;
  }
}
