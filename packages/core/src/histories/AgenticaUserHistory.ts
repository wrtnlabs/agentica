import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import type { AgenticaHistoryBase } from "./AgenticaHistoryBase";
import type { AgenticaUserContent } from "./contents/AgenticaUserContent";

export interface AgenticaUserHistory extends AgenticaHistoryBase<"user", IAgenticaHistoryJson.IUser> {
  contents: AgenticaUserContent[];
}
