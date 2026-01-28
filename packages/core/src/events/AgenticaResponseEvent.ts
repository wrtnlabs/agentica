import type OpenAI from "openai";

import type { AgenticaEventBase } from "./AgenticaEventBase";
import type { AgenticaEventSource } from "./AgenticaEventSource";

export interface AgenticaResponseEvent extends AgenticaEventBase<"response"> {
  request_id: string;

  /**
   * The source agent of the response.
   */
  source: AgenticaEventSource;

  /**
   * Request body.
   */
  body: OpenAI.ChatCompletionCreateParamsStreaming;

  /**
   * The response data.
   */
  response: AgenticaResponseEvent.Response;

  /**
   * Options for the request.
   */
  options?: OpenAI.RequestOptions | undefined;

  /**
   * Wait the completion.
   */
  join: () => Promise<OpenAI.ChatCompletion>;
}
export namespace AgenticaResponseEvent {
  export type Response = StreamResponse | NonStreamResponse;
  export interface StreamResponse {
    stream: true;
    data: AsyncGenerator<OpenAI.ChatCompletionChunk, undefined, undefined>;
  }
  export interface NonStreamResponse {
    stream: false;
    data: OpenAI.ChatCompletion;
  }
}
