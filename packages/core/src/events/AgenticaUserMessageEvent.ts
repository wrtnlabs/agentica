import type { AgenticaUserMessageContent } from "../histories";
import type { AgenticaUserMessageHistory } from "../histories/AgenticaUserMessageHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaUserMessageEvent
  extends AgenticaEventBase<"userMessage"> {
  contents: Array<AgenticaUserMessageContent>;
  toJSON: () => IAgenticaEventJson.IUserMessage;
  toHistory: () => AgenticaUserMessageHistory;
}
