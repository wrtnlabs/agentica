import type { AgenticaAssistantMessageHistory } from "../histories/AgenticaAssistantMessageHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaAssistantMessageEvent
  extends AgenticaEventBase<"assistantMessage"> {
  stream: AsyncGenerator<string, undefined, undefined>;
  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IAssistantMessage;
  toHistory: () => AgenticaAssistantMessageHistory;
}
