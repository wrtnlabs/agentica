import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaDescribeHistory<
  Model extends ILlmSchema.Model,
> extends AgenticaHistoryBase<"describe", IAgenticaHistoryJson.IDescribe> {
  /**
   * Executions of the LLM function calling.
   *
   * This prompt describes the return value of them.
   */
  executes: AgenticaExecuteHistory<Model>[];

  /**
   * Description text.
   */
  text: string;
}
