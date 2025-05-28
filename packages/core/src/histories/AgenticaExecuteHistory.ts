import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

/**
 * Execute prompt.
 *
 * @author Samchon
 */
export type AgenticaExecuteHistory<Model extends ILlmSchema.Model> =
  | AgenticaExecuteHistory.Class<Model>
  | AgenticaExecuteHistory.Http<Model>;
export namespace AgenticaExecuteHistory {
  /**
   * Class protocol case.
   */
  export interface Class<Model extends ILlmSchema.Model>
    extends Base<"class", AgenticaOperation.Class<Model>, unknown> {}

  /**
   * HTTP protocol case.
   */
  export interface Http<Model extends ILlmSchema.Model>
    extends Base<"http", AgenticaOperation.Http<Model>, IHttpResponse> {}

  interface Base<
    Protocol extends "http" | "class",
    Operation extends AgenticaOperation<any>,
    Value,
  > extends AgenticaHistoryBase<"execute", IAgenticaHistoryJson.IExecute> {
    /**
     * Protocol of the operation.
     */
    protocol: Protocol;

    /**
     * Target operation that has been called.
     */
    operation: Operation;

    /**
     * Arguments of the function calling.
     */
    arguments: Record<string, unknown>;

    /**
     * Return value.
     *
     * If the protocol is "class", the return value of the class function.
     *
     * Otherwise "http", the return value is an HTTP response.
     */
    value: Value;
  }
}
