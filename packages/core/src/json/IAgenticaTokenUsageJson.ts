/**
 * Token usage information from the A.I. chatbot.
 *
 * `IAgenticaTokenUsageJson` is a structure representing the token usage
 * information from the {@link Agentica} class. And you can get the
 * token usage information by calling the {@link Agentica.getTokenUsage}
 * method.
 *
 * For reference, `IAgenticaTokenUsageJson` provides only the token usage
 * information, and does not contain any price or cost information. It is
 * because the price or cost can be changed by below reasons.
 *
 * - Type of {@link IAgenticaProps.vendor LLM vendor}
 * - {@link IAgenticaVendor.model} in the LLM vendor.
 * - Just by a policy change of the LLM vendor company.
 *
 * @author Samchon
 */
export interface IAgenticaTokenUsageJson {
  /**
   * Aggregated token usage.
   */
  aggregate: IAgenticaTokenUsageJson.IComponent;

  /**
   * Token uasge of initializer agent.
   */
  initialize: IAgenticaTokenUsageJson.IComponent;

  /**
   * Token usage of function selector agent.
   */
  select: IAgenticaTokenUsageJson.IComponent;

  /**
   * Token usage of function canceler agent.
   */
  cancel: IAgenticaTokenUsageJson.IComponent;

  /**
   * Token usage of function caller agent.
   */
  call: IAgenticaTokenUsageJson.IComponent;

  /**
   * Token usage of function calling describer agent.
   */
  describe: IAgenticaTokenUsageJson.IComponent;
}
export namespace IAgenticaTokenUsageJson {
  export interface IComponent {
    /**
     * Total token usage.
     */
    total: number;

    /**
     * Input token usage of detailed.
     */
    input: IInput;

    /**
     * Output token usage of detailed.
     */
    output: IOutput;
  }

  /**
   * Input token usage of detailed.
   */
  export interface IInput {
    /**
     * Total amount of input token uasge.
     */
    total: number;

    /**
     * Cached token usage.
     */
    cached: number;
  }

  /**
   * Output token usage of detailed.
   */
  export interface IOutput {
    /**
     * Total amount of output token usage.
     */
    total: number;

    /**
     * Reasoning token usage.
     */
    reasoning: number;

    /**
     * Prediction token usage.
     */
    accepted_prediction: number;

    /**
     * Rejected prediction token usage.
     */
    rejected_prediction: number;
  }
}
