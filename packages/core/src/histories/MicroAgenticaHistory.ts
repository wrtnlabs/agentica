import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantHistory } from "./AgenticaAssistantHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaUserHistory } from "./AgenticaUserHistory";

export type MicroAgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaAssistantHistory
  | AgenticaUserHistory;
export namespace MicroAgenticaHistory {
  export type Type = MicroAgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    describe: AgenticaDescribeHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    text: AgenticaAssistantHistory;
  }
}
