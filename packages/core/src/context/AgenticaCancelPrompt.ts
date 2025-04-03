import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import type { AgenticaPromptBase } from "../prompts/AgenticaPromptBase";

import type { AgenticaOperationSelection } from "./AgenticaOperationSelection";

export interface AgenticaCancelPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"cancel", IAgenticaPromptJson.ICancel> {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}
