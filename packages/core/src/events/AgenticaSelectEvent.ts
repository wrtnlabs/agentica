import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { AgenticaCallReasoningPayload } from "../histories/contents/AgenticaCallReasoningPayload";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaSelectEvent extends AgenticaEventBase<"select">, AgenticaCallReasoningPayload {
  selection: AgenticaOperationSelection;
  toJSON: () => IAgenticaEventJson.ISelect;
  toHistory: () => AgenticaSelectHistory;
}
