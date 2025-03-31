import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import type { AgenticaPromptBase } from "./AgenticaPromptBase";

export interface AgenticaSelectPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"select", IAgenticaPromptJson.ISelect> {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}
