import type OpenAI from "openai";

import type { AgenticaEventBase } from "./AgenticaEventBase";
import type { AgenticaEventSource } from "./AgenticaEventSource";

export type AgenticaResponseEvent =
  | AgenticaResponseEvent.Streaming
  | AgenticaResponseEvent.NonStreaming;
export namespace AgenticaResponseEvent {
  export type Streaming = Base<
    true,
    OpenAI.ChatCompletionCreateParamsStreaming,
    AsyncGenerator<OpenAI.ChatCompletionChunk, undefined, undefined>
  >;

  export type NonStreaming = Base<
    false,
    OpenAI.ChatCompletionCreateParamsNonStreaming,
    OpenAI.ChatCompletion
  >;

  interface Base<Stream extends boolean, Body extends object, Completion extends object>
    extends AgenticaEventBase<"response"> {
    source: AgenticaEventSource;
    request_id: string;
    stream: Stream;
    body: Body;
    completion: Completion;
    options?: OpenAI.RequestOptions | undefined;
    join: () => Promise<OpenAI.ChatCompletion>;
  }
}
