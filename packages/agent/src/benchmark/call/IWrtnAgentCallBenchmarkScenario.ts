import { IWrtnAgentBenchmarkExpected } from "../common/IWrtnAgentBenchmarkExpected";

/**
 * Scenario of function calling.
 *
 * `IWrtnAgentCallBenchmarkScenario` is a data structure which
 * represents a function calling benchmark scenario. It contains two
 * properties; {@linkk text} and {@link operations}.
 *
 * The {@link text} means the conversation text from the user, and
 * the other {@link operations} are the expected operations that
 * should be selected by the `caller` agent through the {@link text}
 * conversation.
 *
 * @author Samchon
 */
export interface IWrtnAgentCallBenchmarkScenario {
  /**
   * Name of the scenario.
   *
   * It must be unique within the benchmark scenarios.
   */
  name: string;

  /**
   * The prompt text from user.
   */
  text: string;

  /**
   * Expected function calling sequence.
   */
  expected: IWrtnAgentBenchmarkExpected;
}
