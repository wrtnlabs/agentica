import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaSelectHistory<
  Model extends ILlmSchema.Model,
> extends AgenticaHistoryBase<"select", IAgenticaHistoryJson.ISelect> {
  selections: AgenticaOperationSelection<Model>[];
}
