import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaDescribeEvent extends AgenticaEventBase<"describe"> {
  executes: AgenticaExecuteHistory[];
  stream: AsyncGenerator<string, undefined, undefined>;

  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IDescribe;
  toHistory: () => AgenticaDescribeHistory;
}
