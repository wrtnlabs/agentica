import type OpenAI from "openai";

import type { AgenticaEventBase } from "./AgenticaEventBase";
import type { AgenticaEventSource } from "./AgenticaEventSource";

export interface AgenticaResponseEvent extends AgenticaEventBase<"response"> {
  /**
   * The source agent of the response.
   */
  source: AgenticaEventSource;

  /**
   * Request body.
   */
  body: OpenAI.ChatCompletionCreateParamsStreaming;

  /**
   * The text content stream.
   */
  stream: ReadableStream<OpenAI.ChatCompletionChunk>;

  /**
   * Options for the request.
   */
  options?: OpenAI.RequestOptions | undefined;

  /**
   * Wait the completion.
   */
  join: () => Promise<OpenAI.ChatCompletion>;
}
