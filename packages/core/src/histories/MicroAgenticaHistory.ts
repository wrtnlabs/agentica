import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaDescribeHistory } from "./AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaTextHistory } from "./AgenticaTextHistory";

export type MicroAgenticaHistory<Model extends ILlmSchema.Model> =
  | AgenticaDescribeHistory<Model>
  | AgenticaExecuteHistory<Model>
  | AgenticaTextHistory;
export namespace MicroAgenticaHistory {
  export type Type = MicroAgenticaHistory<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    describe: AgenticaDescribeHistory<Model>;
    execute: AgenticaExecuteHistory<Model>;
    text: AgenticaTextHistory;
  }
}
