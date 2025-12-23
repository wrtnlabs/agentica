import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaCancelEvent extends AgenticaEventBase<"cancel"> {
  selection: AgenticaOperationSelection;
  toJSON: () => IAgenticaEventJson.ICancel;
}
