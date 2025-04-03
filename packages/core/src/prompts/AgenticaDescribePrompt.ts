import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";

import type { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import type { AgenticaPromptBase } from "./AgenticaPromptBase";

export interface AgenticaDescribePrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"describe", IAgenticaPromptJson.IDescribe> {
  /**
   * Executions of the LLM function calling.
   *
   * This prompt describes the return value of them.
   */
  executes: AgenticaExecutePrompt<Model>[];

  /**
   * Description text.
   */
  text: string;
}
