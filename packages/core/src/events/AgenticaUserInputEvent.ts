import type { ChatCompletionContentPart } from "openai/resources";

import type { AgenticaUserInputHistory } from "../histories/AgenticaUserInputHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaUserInputEvent extends AgenticaEventBase<"user_input"> {
  role: "user";
  contents: Array<ChatCompletionContentPart>;
  toJSON: () => IAgenticaEventJson.IUserInput;
  toHistory: () => AgenticaUserInputHistory;
}
