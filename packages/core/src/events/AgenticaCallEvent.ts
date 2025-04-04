import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

/**
 * Event of a function calling.
 *
 * @author Samchon
 */
export interface AgenticaCallEvent<Model extends ILlmSchema.Model>
  extends AgenticaEventBase<"call"> {
  /**
   * ID of the tool calling.
   */
  id: string;

  /**
   * Target operation to call.
   */
  operation: AgenticaOperation<Model>;

  /**
   * Arguments of the function calling.
   *
   * If you modify this {@link arguments} property, it actually modifies
   * the backend server's request. Therefore, be careful when you're
   * trying to modify this property.
   */
  arguments: Record<string, any>;

  toJSON: () => IAgenticaEventJson.ICall;
}
