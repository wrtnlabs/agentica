import type OpenAI from "openai";

import type { AgenticaEventBase } from "./AgenticaEventBase";
import type { AgenticaEventSource } from "./AgenticaEventSource";

export interface AgenticaRequestEvent extends AgenticaEventBase<"request"> {
  source: AgenticaEventSource;
  body: OpenAI.ChatCompletionCreateParamsStreaming;
  options?: OpenAI.RequestOptions | undefined;
}
