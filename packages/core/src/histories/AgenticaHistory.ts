import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantMessageHistory } from "./AgenticaAssistantMessageHistory";
import type { AgenticaCancelHistory } from "./AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaSelectHistory } from "./AgenticaSelectHistory";
import type { AgenticaSystemMessageHistory } from "./AgenticaSystemMessageHistory";
import type { AgenticaUserMessageHistory } from "./AgenticaUserMessageHistory";

export type AgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaCancelHistory<Model>
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaSelectHistory<Model>
  | AgenticaAssistantMessageHistory
  | AgenticaUserMessageHistory
  | AgenticaSystemMessageHistory;
export namespace AgenticaHistory {
  export type Type = AgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    select: AgenticaSelectHistory<Model>;
    cancel: AgenticaCancelHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    describe: AgenticaDescribeHistory<Model>;
    assistantMessage: AgenticaAssistantMessageHistory;
    systemMessage: AgenticaSystemMessageHistory;
    userMessage: AgenticaUserMessageHistory;
  }
}
