import type OpenAI from "openai";
import type { Semaphore } from "tstl";

/**
 * LLM service vendor for Agentica Chat.
 *
 * `IAgenticaVendor` is a type represents an LLM
 * (Large Language Model) vendor of the {@link Agentica}.
 *
 * Currently, {@link Agentica} supports OpenAI SDK. However, it does
 * not mean that you can use only OpenAI's GPT model in the
 * {@link Agentica}. The OpenAI SDK is just a connection tool to the
 * LLM vendor's API, and you can use other LLM vendors by configuring
 * its `baseURL` and API key.
 *
 * Therefore, if you want to use another LLM vendor like Claude or
 * Gemini, please configure the `baseURL` to the {@link api}, and
 * set {@link IAgenticaController}'s schema model as "cluade" or
 * "gemini".
 *
 * @author Samchon
 */
export interface IAgenticaVendor {
  /**
   * OpenAI API instance.
   */
  api: OpenAI;

  /**
   * Chat model to be used.
   *
   * `({}) & string` means to support third party hosting cloud(eg. openRouter, aws)
   */
  model: OpenAI.ChatModel | ({} & string);

  /**
   * Options for the request.
   */
  options?: OpenAI.RequestOptions | undefined;

  /**
   * Number of concurrent requests allowed.
   *
   * If you configure this property, {@link Agentica} will constrain the
   * number of concurrent requests to the LLM vendor. If you want to
   * share the semaphore instance with other agents, you can directly
   * assign the {@link Semaphore} instance to this property.
   *
   * Otherwise, it will not limit the number of concurrent
   * requests, and the {@link Agentica} will send requests
   * asynchronously without any limit.
   */
  semaphore?: Semaphore | number | undefined;
}
