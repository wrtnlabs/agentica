import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaSystemMessageHistory extends AgenticaHistoryBase<
  "systemMessage",
  IAgenticaHistoryJson.ISystemMessage
> {
  text: string;
}
