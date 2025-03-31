import type { ILlmSchema } from "@samchon/openapi";
import type { IAgenticaOperationSelectionJson } from "../json/IAgenticaOperationSelectionJson";
import type { AgenticaOperation } from "./AgenticaOperation";

export interface AgenticaOperationSelection<Model extends ILlmSchema.Model> {
  operation: AgenticaOperation<Model>;
  reason: string;
  toJSON: () => IAgenticaOperationSelectionJson;
}
