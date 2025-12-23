import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaExecuteHistory } from "./AgenticaExecuteHistory";
import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";

export interface AgenticaDescribeHistory extends AgenticaHistoryBase<"describe", IAgenticaHistoryJson.IDescribe> {
  /**
   * Executions of the LLM function calling.
   *
   * This prompt describes the return value of them.
   */
  executes: AgenticaExecuteHistory[];

  /**
   * Description text.
   */
  text: string;
}
