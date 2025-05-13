import type { AgenticaEvent } from "../events";
import type { Fail, Pass } from "../utils/types";

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
    Fail
  >(),
]);
