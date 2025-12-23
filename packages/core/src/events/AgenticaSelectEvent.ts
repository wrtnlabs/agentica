import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaSelectEvent extends AgenticaEventBase<"select"> {
  selection: AgenticaOperationSelection;
  toJSON: () => IAgenticaEventJson.ISelect;
  toHistory: () => AgenticaSelectHistory;
}
