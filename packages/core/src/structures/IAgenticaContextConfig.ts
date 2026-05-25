/**
 * Model-facing context projection options.
 *
 * These options affect the messages sent to the LLM. They do not rewrite
 * public histories or their JSON serialization.
 */
export interface IAgenticaContextConfig {
  /**
   * Function execution result budget.
   *
   * When configured, large function results are projected as a deterministic
   * preview/reference object in model-facing tool messages.
   */
  resultBudget?: IAgenticaResultBudgetConfig;
}

/**
 * Budget for projecting function execution results.
 */
export interface IAgenticaResultBudgetConfig {
  /**
   * Maximum serialized characters to inline for one execution result value.
   *
   * Values beyond this limit are replaced by a preview/reference object in
   * the model-facing context. The original history value is preserved.
   */
  maxResultCharacters?: number;

  /**
   * Number of most recent execution results to keep fully inlined.
   *
   * @default 0
   */
  preserveRecentResults?: number;
}
