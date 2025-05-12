import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";
import type { AgenticaUserMessageContent } from "./contents/AgenticaUserMessageContent";

export interface AgenticaUserMessageHistory extends AgenticaHistoryBase<
  "userMessage",
  IAgenticaHistoryJson.IUserMessage
> {
  contents: AgenticaUserMessageContent[];
}
