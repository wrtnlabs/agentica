import type { ILlmSchema } from "@samchon/openapi";
import type { IValidation } from "typia";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

/**
 * Event of a validation feedback.
 *
 * @author Samchon
 */
export interface AgenticaValidateEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"validate"> {
  /**
   * ID of the tool calling.
   */
  id: string;

  /**
   * Target operation to call.
   */
  operation: AgenticaOperation<Model>;

  /**
   * Validation result as a failure.
   */
  result: IValidation.IFailure;

  life: number;

  toJSON: () => IAgenticaEventJson.IValidate;
}
