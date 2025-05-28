import type { IAgenticaHistoryJson } from "@agentica/core";

export interface IAgenticaDescribeEventStart {
  type: "describeMessageStart";
  executes: IAgenticaHistoryJson.IExecute[];
}
