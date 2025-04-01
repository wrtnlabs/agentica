import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";

import type { AgenticaDescribePrompt } from "./AgenticaDescribePrompt";
import type { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import type { AgenticaSelectPrompt } from "./AgenticaSelectPrompt";
import type { AgenticaTextPrompt } from "./AgenticaTextPrompt";

export type AgenticaPrompt<Model extends ILlmSchema.Model> =
  | AgenticaCancelPrompt<Model>
  | AgenticaDescribePrompt<Model>
  | AgenticaExecutePrompt<Model>
  | AgenticaSelectPrompt<Model>
  | AgenticaTextPrompt;
export namespace AgenticaPrompt {
  export type Type = AgenticaPrompt<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    cancel: AgenticaCancelPrompt<Model>;
    describe: AgenticaDescribePrompt<Model>;
    execute: AgenticaExecutePrompt<Model>;
    select: AgenticaSelectPrompt<Model>;
    text: AgenticaTextPrompt;
  }
}
