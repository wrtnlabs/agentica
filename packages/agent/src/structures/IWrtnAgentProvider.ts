import OpenAI from "openai";

/**
 * LLM Provider for Nestia Chat.
 *
 * `IWrtnAgentProvider` is a type represents an LLM
 * (Large Language Model) provider of the {@link WrtnAgent}.
 *
 * Currently, {@link WrtnAgent} is supporting only one provider OpenAI.
 * You can specify the provider by configuring the `type` property as
 * `"chatgpt"`. Also, you have to assign the OpenAI API client instance
 * to the `api` property, and specify the `model` to use.
 *
 * If you want to use another LLM provider like Claude or Gemini,
 * please write an issue or contribute to `nestia` please.
 *
 * @author Samchon
 */
export type IWrtnAgentProvider = IWrtnAgentProvider.IChatGpt;
export namespace IWrtnAgentProvider {
  /**
   * OpenAI provider.
   */
  export interface IChatGpt {
    /**
     * Discriminator type.
     */
    type: "chatgpt";

    /**
     * OpenAI API instance.
     */
    api: OpenAI;

    /**
     * Chat model to be used.
     */
    model: OpenAI.ChatModel;

    /**
     * Options for the request.
     */
    options?: OpenAI.RequestOptions | undefined;
  }
}
