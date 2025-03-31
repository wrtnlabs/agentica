import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaCancelEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"cancel"> {
  selection: AgenticaOperationSelection<Model>;
  toJSON: () => IAgenticaEventJson.ICancel;
}
