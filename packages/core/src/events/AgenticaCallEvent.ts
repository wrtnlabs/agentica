import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

/**
 * Event of a function calling.
 *
 * @author Samchon
 */
export interface AgenticaCallEvent extends AgenticaEventBase<"call"> {
  /**
   * Target operation to call.
   */
  operation: AgenticaOperation;

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
