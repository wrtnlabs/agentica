import type { AgenticaAssistantMessageHistory } from "./AgenticaAssistantMessageHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaUserMessageHistory } from "./AgenticaUserMessageHistory";

export type MicroAgenticaHistory =
  | AgenticaDescribeHistory
  | AgenticaExecuteHistory
  | AgenticaAssistantMessageHistory
  | AgenticaUserMessageHistory;
export namespace MicroAgenticaHistory {
  export type Type = MicroAgenticaHistory["type"];
  export interface Mapper {
    describe: AgenticaDescribeHistory;
    execute: AgenticaExecuteHistory;
    userMessage: AgenticaUserMessageHistory;
    assistantMessage: AgenticaAssistantMessageHistory;
  }
}
