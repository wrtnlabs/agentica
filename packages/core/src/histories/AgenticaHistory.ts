import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantHistory } from "./AgenticaAssistantHistory";
import type { AgenticaCancelHistory } from "./AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaSelectHistory } from "./AgenticaSelectHistory";
import type { AgenticaUserHistory } from "./AgenticaUserHistory";

export type AgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaCancelHistory<Model>
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaSelectHistory<Model>
  | AgenticaAssistantHistory
  | AgenticaUserHistory;
export namespace AgenticaHistory {
  export type Type = AgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    assistant: AgenticaAssistantHistory;
    user: AgenticaUserHistory;
    select: AgenticaSelectHistory<Model>;
    cancel: AgenticaCancelHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    describe: AgenticaDescribeHistory<Model>;
  }
}
