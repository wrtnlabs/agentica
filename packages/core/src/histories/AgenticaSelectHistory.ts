import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaSelectHistory extends AgenticaHistoryBase<"select", IAgenticaHistoryJson.ISelect> {
  selection: AgenticaOperationSelection;
}
