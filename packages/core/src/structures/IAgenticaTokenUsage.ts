/**
 * Token usage information from the A.I. chatbot.
 *
 * `IAgenticaTokenUsage` is a structure representing the token usage
 * information from the {@link Agentica} class. And you can get the
 * token usage information by calling the {@link Agentica.getTokenUsage}
 * method.
 *
 * For reference, `IAgenticaTokenUsage` provides only the token usage
 * information, and does not contain any price or cost information. It is
 * because the price or cost can be changed by below reasons.
 *
 * - Type of {@link IAgenticaProps.provider LLM provider}
 * - {@link IAgenticaProvider.model} in the LLM provider.
 * - Just by a policy change of the LLM provider company.
 *
 * @author Samchon
 */
export interface IAgenticaTokenUsage {
  /**
   * Aggregated token usage.
   */
  aggregate: IAgenticaTokenUsage.IComponent<"aggregate">;

  /**
   * Token uasge of initializer agent.
   */
  initialize: IAgenticaTokenUsage.IComponent<"initialize">;

  /**
   * Token usage of function selector agent.
   */
  select: IAgenticaTokenUsage.IComponent<"select">;

  /**
   * Token usage of function canceler agent.
   */
  cancel: IAgenticaTokenUsage.IComponent<"cancel">;

  /**
   * Token usage of function caller agent.
   */
  call: IAgenticaTokenUsage.IComponent<"call">;

  /**
   * Token usage of function calling describer agent.
   */
  describe: IAgenticaTokenUsage.IComponent<"describe">;
}
export namespace IAgenticaTokenUsage {
  export interface IComponent<Type extends string> {
    /**
     * Discriminator type.
     */
    type: Type;

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
