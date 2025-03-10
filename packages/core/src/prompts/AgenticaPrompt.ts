import { ILlmSchema } from "@samchon/openapi";

import { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";
import { AgenticaDescribePrompt } from "./AgenticaDescribePrompt";
import { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import { AgenticaSelectPrompt } from "./AgenticaSelectPrompt";
import { AgenticaTextPrompt } from "./AgenticaTextPrompt";

export type AgenticaPrompt<Model extends ILlmSchema.Model> =
  | AgenticaCancelPrompt<Model>
  | AgenticaDescribePrompt<Model>
  | AgenticaExecutePrompt<Model>
  | AgenticaSelectPrompt<Model>
  | AgenticaTextPrompt;
