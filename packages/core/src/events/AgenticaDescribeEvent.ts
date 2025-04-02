import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import type { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaDescribeEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"describe"> {
  executes: AgenticaExecutePrompt<Model>[];
  stream: ReadableStream<string>;

  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IDescribe;
  toPrompt: () => AgenticaDescribePrompt<Model>;
}
