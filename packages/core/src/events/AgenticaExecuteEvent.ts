import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { AgenticaEventBase } from "./AgenticaEventBase";

export type AgenticaExecuteEvent<Model extends ILlmSchema.Model> =
  | AgenticaExecuteEvent.Class<Model>
  | AgenticaExecuteEvent.Protocol<Model>;
export namespace AgenticaExecuteEvent {
  export interface Class<Model extends ILlmSchema.Model>
    extends Base<
      "class",
      AgenticaOperation.Class<Model>,
      AgenticaExecutePrompt.Class<Model>,
      unknown
    > {}

  export interface Protocol<Model extends ILlmSchema.Model>
    extends Base<
      "http",
      AgenticaOperation.Http<Model>,
      AgenticaExecutePrompt.Http<Model>,
      IHttpResponse
    > {}

  interface Base<
    Protocol extends "http" | "class",
    Operation extends AgenticaOperation<any>,
    Prompt extends AgenticaExecutePrompt<any>,
    Value,
  > extends AgenticaEventBase<"execute"> {
    protocol: Protocol;
    id: string;
    operation: Operation;
    arguments: Record<string, unknown>;
    value: Value;

    toJSON: () => IAgenticaEventJson.IExecute;
    toPrompt: () => Prompt;
  }
}
