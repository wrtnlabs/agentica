import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";
import type { AgenticaHistoryBase } from "../histories/AgenticaHistoryBase";

import type { AgenticaOperationSelection } from "./AgenticaOperationSelection";

export interface AgenticaCancelPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaHistoryBase<"cancel", IAgenticaHistoryJson.ICancel> {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}
