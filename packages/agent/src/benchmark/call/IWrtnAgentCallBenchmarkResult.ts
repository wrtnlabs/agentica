import { IWrtnAgentTokenUsage } from "../../structures/IWrtnAgentTokenUsage";
import { IWrtnAgentCallBenchmarkEvent } from "./IWrtnAgentCallBenchmarkEvent";
import { IWrtnAgentCallBenchmarkScenario } from "./IWrtnAgentCallBenchmarkScenario";

/**
 * Result of the LLM function calling benchmark.
 *
 * `IWrtnAgentCallBenchmarkResult` is a structure representing the result
 * of the LLM function calling benchmark executed by the
 * {@link WrtnAgentCallBenchmark.execute execute} function.
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
export interface IWrtnAgentCallBenchmarkResult {
  /**
   * Experiments for each scenario.
   */
  experiments: IWrtnAgentCallBenchmarkResult.IExperiment[];

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
export namespace IWrtnAgentCallBenchmarkResult {
  /**
   * Experiment result about a scenario.
   */
  export interface IExperiment {
    /**
     * Scenario of the experiment.
     */
    scenario: IWrtnAgentCallBenchmarkScenario;

    /**
     * Events occurred during the benchmark in the scenario.
     *
     * When benchmarking a scenario, {@link WrtnAgentCallBenchmark} will
     * test a scenario multiple times with the given
     * {@link WrtnAgentCallBenchmark.IConfig.repeat repeat} count.
     * And the event is one of the repeated benchmark results.
     */
    events: IWrtnAgentCallBenchmarkEvent[];

    /**
     * LLM token usage information.
     */
    usage: IWrtnAgentTokenUsage;
  }
}
