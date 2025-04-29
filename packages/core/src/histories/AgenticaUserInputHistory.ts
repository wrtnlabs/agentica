import type { ChatCompletionContentPart } from "openai/resources/chat/completions/completions";

import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaUserInputHistory extends AgenticaHistoryBase<"user_input", IAgenticaHistoryJson.IUserInput> {
  role: "user";
  contents: Array<ChatCompletionContentPart>;
}
