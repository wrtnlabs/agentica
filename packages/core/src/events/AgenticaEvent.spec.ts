import type { AgenticaHistory } from "../histories";
import type { Pass } from "../utils/types";

import { check, checks } from "../utils/types";

import type { AgenticaEvent } from "./AgenticaEvent";

checks([
  check<
    AgenticaHistory.Type extends AgenticaEvent.Type ? true : false,
    true,
    Pass
  >(),
  check<
    AgenticaHistory.Type extends keyof AgenticaEvent.Mapper<any> ? true : false,
    true,
    Pass
  >(),
]);
