import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";
import type { AgenticaCallReasoningPayload } from "./contents/AgenticaCallReasoningPayload";

export interface AgenticaCancelHistory extends AgenticaHistoryBase<"cancel", IAgenticaHistoryJson.ICancel>, AgenticaCallReasoningPayload {
  selection: AgenticaOperationSelection;
}
