import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaJsonParseErrorEvent<Model extends ILlmSchema.Model>
  extends AgenticaEventBase<"jsonParseError"> {
  /**
   * ID of the tool calling.
   */
  call_id: string;
  operation: AgenticaOperation<Model>;
  arguments: string;
  errorMessage: string;
  life: number;
}
