import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";

import type { AgenticaPromptBase } from "./AgenticaPromptBase";

export interface AgenticaCancelPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"cancel", IAgenticaPromptJson.ICancel> {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}
