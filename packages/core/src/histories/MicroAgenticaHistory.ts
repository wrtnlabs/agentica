import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantMessageHistory } from "./AgenticaAssistantMessageHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaUserMessageHistory } from "./AgenticaUserMessageHistory";

export type MicroAgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaAssistantMessageHistory
  | AgenticaUserMessageHistory;
export namespace MicroAgenticaHistory {
  export type Type = MicroAgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    describe: AgenticaDescribeHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    userMessage: AgenticaUserMessageHistory;
    assistantMessage: AgenticaAssistantMessageHistory;
  }
}
