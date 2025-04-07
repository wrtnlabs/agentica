import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import type { AgenticaTextHistory } from "../histories/AgenticaTextHistory";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaTextEvent<
  Role extends "assistant" | "user" = "assistant" | "user",
> extends AgenticaEventBase<"text"> {
  role: Role;
  stream: ReadableStream<string>;
  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IText;
  toPrompt: () => AgenticaTextHistory;
}
