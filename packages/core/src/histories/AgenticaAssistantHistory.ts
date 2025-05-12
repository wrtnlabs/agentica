import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaAssistantHistory
  extends AgenticaHistoryBase<"assistant", IAgenticaHistoryJson.IAssistant> {
  text: string;
}
