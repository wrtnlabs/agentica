import { ILlmSchema } from "@samchon/openapi";

import { AgenticaCancelPrompt } from "./AgenticaCancelPrompt";
import { AgenticaDescribePrompt } from "./AgenticaDescribePrompt";
import { AgenticaSelectPrompt } from "./AgenticaSelectPrompt";
import { AgenticaTextPrompt } from "./AgenticaTextPrompt";

export type AgenticaPrompt<Model extends ILlmSchema.Model> =
  | AgenticaCancelPrompt<Model>
  | AgenticaDescribePrompt<Model>
  | AgenticaDescribePrompt<Model>
  | AgenticaSelectPrompt<Model>
  | AgenticaTextPrompt;
