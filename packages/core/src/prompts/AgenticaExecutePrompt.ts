import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import type { AgenticaPromptBase } from "./AgenticaPromptBase";

/**
 * Execute prompt.
 *
 * @author Samchon
 */
export type AgenticaExecutePrompt<Model extends ILlmSchema.Model> =
  | AgenticaExecutePrompt.Class<Model>
  | AgenticaExecutePrompt.Http<Model>;
export namespace AgenticaExecutePrompt {
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
  > extends AgenticaPromptBase<"execute", IAgenticaPromptJson.IExecute> {
    /**
     * ID of the LLM tool call result.
     */
    id: string;

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
