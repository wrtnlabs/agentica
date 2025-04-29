import type { AgenticaTextHistory } from "../histories/AgenticaTextHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaTextEvent extends AgenticaEventBase<"text"> {
  role: "assistant";
  stream: AsyncGenerator<string, undefined, undefined>;
  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IText;
  toHistory: () => AgenticaTextHistory;
}
