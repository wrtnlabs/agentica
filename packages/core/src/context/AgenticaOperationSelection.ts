import type { IAgenticaOperationSelectionJson } from "../json/IAgenticaOperationSelectionJson";

import type { AgenticaOperation } from "./AgenticaOperation";

export interface AgenticaOperationSelection {
  operation: AgenticaOperation;
  reason: string;
  toJSON: () => IAgenticaOperationSelectionJson;
}
