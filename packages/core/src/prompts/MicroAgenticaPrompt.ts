import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaDescribePrompt } from "./AgenticaDescribePrompt";
import type { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import type { AgenticaTextPrompt } from "./AgenticaTextPrompt";

export type MicroAgenticaPrompt<Model extends ILlmSchema.Model> =
  | AgenticaDescribePrompt<Model>
  | AgenticaExecutePrompt<Model>
  | AgenticaTextPrompt;
export namespace MicroAgenticaPrompt {
  export type Type = MicroAgenticaPrompt<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    describe: AgenticaDescribePrompt<Model>;
    execute: AgenticaExecutePrompt<Model>;
    text: AgenticaTextPrompt;
  }
}
