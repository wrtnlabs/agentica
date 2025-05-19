import type { AgenticaHistory } from "../histories";
import type { Pass } from "../utils/types";

import { check, checks } from "../utils/types";

import type { AgenticaEvent } from "./AgenticaEvent";

checks([
  check<
    Exclude<AgenticaHistory.Type, "systemMessage"> extends AgenticaEvent.Type ? true : false,
    true,
    Pass
  >(),
  check<
    Exclude<AgenticaHistory.Type, "systemMessage"> extends keyof AgenticaEvent.Mapper<any> ? true : false,
    true,
    Pass
  >(),
]);
