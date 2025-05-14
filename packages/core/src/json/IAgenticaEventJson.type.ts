import type { AgenticaEvent } from "../events";
import type { Pass } from "../utils/types";

import { check, checks } from "../utils/types";

import type { IAgenticaEventJson } from "./IAgenticaEventJson";

checks([
  check<
    AgenticaEvent.Type,
    IAgenticaEventJson.Type,
    Pass
  >(),
  check<
    AgenticaEvent.Type,
    keyof IAgenticaEventJson.Mapper,
    Pass
  >(),
]);
