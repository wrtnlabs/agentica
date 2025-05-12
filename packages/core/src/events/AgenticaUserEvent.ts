import type { AgenticaUserContent } from "../histories";
import type { AgenticaUserHistory } from "../histories/AgenticaUserHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaUserEvent extends AgenticaEventBase<"user"> {
  contents: Array<AgenticaUserContent>;
  toJSON: () => IAgenticaEventJson.IUser;
  toHistory: () => AgenticaUserHistory;
}
