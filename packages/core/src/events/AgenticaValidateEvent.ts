import type { IValidation } from "typia";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

/**
 * Event of a validation feedback.
 *
 * @author Samchon
 */
export interface AgenticaValidateEvent extends AgenticaEventBase<"validate"> {
  /**
   * ID of the tool calling.
   */
  call_id: string;

  /**
   * Target operation to call.
   */
  operation: AgenticaOperation;

  /**
   * Validation result as a failure.
   */
  result: IValidation.IFailure;

  life: number;

  toJSON: () => IAgenticaEventJson.IValidate;
}
