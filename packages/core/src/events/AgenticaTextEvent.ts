import type { AgenticaTextHistory } from "../histories/AgenticaTextHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaTextEvent<
  Role extends "assistant" | "user" = "assistant" | "user",
> extends AgenticaEventBase<"text"> {
  role: Role;
  stream: AsyncGenerator<string, undefined, undefined>;
  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IText;
  toHistory: () => AgenticaTextHistory;
}
