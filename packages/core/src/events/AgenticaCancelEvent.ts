import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaCallReasoningPayload } from "../histories/contents/AgenticaCallReasoningPayload";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaCancelEvent extends AgenticaEventBase<"cancel">, AgenticaCallReasoningPayload {
  selection: AgenticaOperationSelection;
  toJSON: () => IAgenticaEventJson.ICancel;
}
