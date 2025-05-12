import type { AgenticaAssistantHistory } from "../histories/AgenticaAssistantHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaAssistantEvent extends AgenticaEventBase<"assistant"> {
  stream: AsyncGenerator<string, undefined, undefined>;
  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IAssistant;
  toHistory: () => AgenticaAssistantHistory;
}
