import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaTextHistory<
  Role extends "assistant" | "user" = "assistant" | "user",
> extends AgenticaHistoryBase<"text", IAgenticaHistoryJson.IText> {
  role: Role;
  text: string;
}
