import { IWrtnAgentOperation } from "../../structures/IWrtnAgentOperation";

/**
 * Scenario of function selection.
 *
 * `IWrtnAgentSelectBenchmarkScenario` is a data structure which
 * represents a function selection benchmark scenario. It contains two
 * properties; {@linkk text} and {@link operations}.
 *
 * The {@link text} means the conversation text from the user, and
 * the other {@link operations} are the expected operations that
 * should be selected by the `selector` agent through the {@link text}
 * conversation.
 *
 * @author Samchon
 */
export interface IWrtnAgentSelectBenchmarkScenario {
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
   * List of operations that should be selected.
   *
   * List of operations (API operation or class function) that
   * should be selected during the `selector` agent from the user's
   * {@link text} conversation for the LLM (Large Language Model)
   * function calling.
   *
   * Note that, sequence of the operations are not important.
   * It's because the `selector` agent has been designed to just
   * list up candidate functions to call, and actual function
   * calling sequence is determined by the `executor` agent.
   */
  operations: IWrtnAgentOperation[];
}
