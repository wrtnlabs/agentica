import type { AgenticaAssistantMessageHistory } from "./AgenticaAssistantMessageHistory";
import type { AgenticaCancelHistory } from "./AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaSelectHistory } from "./AgenticaSelectHistory";
import type { AgenticaSystemMessageHistory } from "./AgenticaSystemMessageHistory";
import type { AgenticaUserMessageHistory } from "./AgenticaUserMessageHistory";

export type AgenticaHistory =
  | AgenticaCancelHistory
  | AgenticaDescribeHistory
  | AgenticaExecuteHistory
  | AgenticaSelectHistory
  | AgenticaAssistantMessageHistory
  | AgenticaUserMessageHistory
  | AgenticaSystemMessageHistory;
export namespace AgenticaHistory {
  export type Type = AgenticaHistory["type"];
  export interface Mapper {
    select: AgenticaSelectHistory;
    cancel: AgenticaCancelHistory;
    execute: AgenticaExecuteHistory;
    describe: AgenticaDescribeHistory;
    assistantMessage: AgenticaAssistantMessageHistory;
    systemMessage: AgenticaSystemMessageHistory;
    userMessage: AgenticaUserMessageHistory;
  }
}
