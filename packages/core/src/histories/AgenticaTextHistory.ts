import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaTextHistory extends AgenticaHistoryBase<"text", IAgenticaHistoryJson.IText> {
  role: "assistant";
  text: string;
}
