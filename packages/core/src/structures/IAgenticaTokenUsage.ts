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
   * Total token usage.
   */
  total: number;

  /**
   * Token usage in the prompt.
   *
   * In other words, it is called as the input token.
   */
  prompt: IAgenticaTokenUsage.IPrompt;

  /**
   * Token usage in the completion.
   *
   * In other words, it is called as the output token.
   */
  completion: IAgenticaTokenUsage.ICompletion;
}
export namespace IAgenticaTokenUsage {
  export interface IPrompt {
    total: number;
    audio: number;
    cached: number;
  }
  export interface ICompletion {
    total: number;
    accepted_prediction: number;
    audio: number;
    reasoning: number;
    rejected_prediction: number;
  }
}
