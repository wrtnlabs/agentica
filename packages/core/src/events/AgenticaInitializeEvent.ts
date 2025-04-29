import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import type { AgenticaEventBase } from "./AgenticaEventBase";

export interface AgenticaInitializeEvent extends AgenticaEventBase<"initialize"> {
  toJSON: () => IAgenticaEventJson.IInitialize;
}
