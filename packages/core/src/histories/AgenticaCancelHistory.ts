import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaCancelHistory extends AgenticaHistoryBase<"cancel", IAgenticaHistoryJson.ICancel> {
  selection: AgenticaOperationSelection;
}
