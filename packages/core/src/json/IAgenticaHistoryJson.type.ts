import type { AgenticaHistory } from "../histories";
import type { Pass } from "../utils/types";

import { check, checks } from "../utils/types";

import type { IAgenticaHistoryJson } from "./IAgenticaHistoryJson";

checks([
  check<
    AgenticaHistory.Type,
    IAgenticaHistoryJson.Type,
    Pass
  >(),
  check<
    AgenticaHistory.Type,
    keyof IAgenticaHistoryJson.Mapper,
    Pass
  >(),
]);
