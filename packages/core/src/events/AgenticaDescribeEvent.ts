import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaDescribeEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"describe"> {
  executes: AgenticaExecuteHistory<Model>[];
  stream: AsyncGenerator<string, undefined, undefined>;

  join: () => Promise<string>;
  toJSON: () => IAgenticaEventJson.IDescribe;
  toHistory: () => AgenticaDescribeHistory<Model>;
}
