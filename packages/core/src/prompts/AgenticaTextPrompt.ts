import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";

import type { AgenticaPromptBase } from "./AgenticaPromptBase";

export interface AgenticaTextPrompt<
  Role extends "assistant" | "user" = "assistant" | "user",
> extends AgenticaPromptBase<"text", IAgenticaPromptJson.IText> {
  role: Role;
  text: string;
}
