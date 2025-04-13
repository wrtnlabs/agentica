import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaSelectEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"select"> {
  selection: AgenticaOperationSelection<Model>;
  toJSON: () => IAgenticaEventJson.ISelect;
  toHistory: () => AgenticaSelectHistory<Model>;
}
