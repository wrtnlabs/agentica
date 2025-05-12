import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaAssistantMessageHistory extends AgenticaHistoryBase<
  "assistantMessage",
  IAgenticaHistoryJson.IAssistantMessage
> {
  text: string;
}
