import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaBenchmarkExpected } from "./IAgenticaBenchmarkExpected";

/**
 * Scenario of function calling.
 *
 * `IAgenticaCallBenchmarkScenario` is a data structure which
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
export interface IAgenticaCallBenchmarkScenario<
  Model extends ILlmSchema.Model,
> {
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
   *
   * Sequence of operations (API operation or class function) that
   * should be called by both `selector` and `caller` agents from
   * the user's {@link text} conversation for the LLM
   * (Large Language Model) function calling.
   */
  expected: IAgenticaBenchmarkExpected<Model>;
}
