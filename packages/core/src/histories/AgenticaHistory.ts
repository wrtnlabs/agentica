import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaCancelHistory } from "./AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaSelectHistory } from "./AgenticaSelectHistory";
import type { AgenticaTextHistory } from "./AgenticaTextHistory";
import type { AgenticaUserInputHistory } from "./AgenticaUserInputHistory";

export type AgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaCancelHistory<Model>
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaSelectHistory<Model>
  | AgenticaTextHistory
  | AgenticaUserInputHistory;
export namespace AgenticaHistory {
  export type Type = AgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    cancel: AgenticaCancelHistory<Model>;
    describe: AgenticaDescribeHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    select: AgenticaSelectHistory<Model>;
    text: AgenticaTextHistory;
    user_input: AgenticaUserInputHistory;
  }
}
