import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaTextPrompt } from "./AgenticaTextPrompt";
import type { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import type { AgenticaDescribePrompt } from "./AgenticaDescribePrompt";

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
