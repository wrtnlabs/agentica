import type { IHttpResponse } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export type AgenticaExecuteEvent =
  | AgenticaExecuteEvent.Class
  | AgenticaExecuteEvent.Protocol;
export namespace AgenticaExecuteEvent {
  export interface Class
    extends Base<
      "class",
      AgenticaOperation.Class,
      AgenticaExecuteHistory.Class,
      unknown
    > {}

  export interface Protocol
    extends Base<
      "http",
      AgenticaOperation.Http,
      AgenticaExecuteHistory.Http,
      IHttpResponse
    > {}

  interface Base<
    Protocol extends "http" | "class",
    Operation extends AgenticaOperation,
    History extends AgenticaExecuteHistory,
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
