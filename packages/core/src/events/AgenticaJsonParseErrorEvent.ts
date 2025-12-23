import type { AgenticaOperation } from "../context/AgenticaOperation";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaJsonParseErrorEvent
  extends AgenticaEventBase<"jsonParseError"> {
  /**
   * ID of the tool calling.
   */
  call_id: string;
  operation: AgenticaOperation;
  arguments: string;
  errorMessage: string;
  life: number;
}
