import type OpenAI from "openai";

import type { AgenticaEventBase } from "./AgenticaEventBase";
import type { AgenticaEventSource } from "./AgenticaEventSource";

export type AgenticaRequestEvent =
  | AgenticaRequestEvent.Streaming
  | AgenticaRequestEvent.NonStreaming;
export namespace AgenticaRequestEvent {
  export type Streaming = Base<
    true,
    OpenAI.ChatCompletionCreateParamsStreaming
  >;

  export type NonStreaming = Base<
    false,
    OpenAI.ChatCompletionCreateParamsNonStreaming
  >;

  interface Base<Stream extends boolean, Body extends object>
    extends AgenticaEventBase<"request"> {
    source: AgenticaEventSource;
    stream: Stream;
    body: Body;
    options?: OpenAI.RequestOptions | undefined;
  }
}
