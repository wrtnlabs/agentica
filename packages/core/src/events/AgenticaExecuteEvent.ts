import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export type AgenticaExecuteEvent<Model extends ILlmSchema.Model> =
  | AgenticaExecuteEvent.Class<Model>
  | AgenticaExecuteEvent.Protocol<Model>;
export namespace AgenticaExecuteEvent {
  export interface Class<Model extends ILlmSchema.Model>
    extends Base<
      "class",
      AgenticaOperation.Class<Model>,
      AgenticaExecuteHistory.Class<Model>,
      unknown
    > {}

  export interface Protocol<Model extends ILlmSchema.Model>
    extends Base<
      "http",
      AgenticaOperation.Http<Model>,
      AgenticaExecuteHistory.Http<Model>,
      IHttpResponse
    > {}

  interface Base<
    Protocol extends "http" | "class",
    Operation extends AgenticaOperation<any>,
    History extends AgenticaExecuteHistory<any>,
    Value,
  > extends AgenticaEventBase<"execute"> {
    protocol: Protocol;
    call_id: string;
    operation: Operation;
    arguments: Record<string, unknown>;
    value: Value;
    success: boolean;

    toJSON: () => IAgenticaEventJson.IExecute;
    toHistory: () => History;
  }
}
