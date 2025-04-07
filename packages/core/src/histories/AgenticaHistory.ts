import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";

import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaSelectHistory } from "./AgenticaSelectHistory";
import type { AgenticaTextHistory } from "./AgenticaTextHistory";

export type AgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaCancelPrompt<Model>
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaSelectHistory<Model>
  | AgenticaTextHistory;
export namespace AgenticaHistory {
  export type Type = AgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    cancel: AgenticaCancelPrompt<Model>;
    describe: AgenticaDescribeHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    select: AgenticaSelectHistory<Model>;
    text: AgenticaTextHistory;
  }
}
