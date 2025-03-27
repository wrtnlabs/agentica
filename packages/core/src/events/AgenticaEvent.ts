import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaCancelEvent } from "./AgenticaCancelEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaInitializeEvent } from "./AgenticaInitializeEvent";
import type { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import type { AgenticaSelectEvent } from "./AgenticaSelectEvent";
import type { AgenticaTextEvent } from "./AgenticaTextEvent";

export type AgenticaEvent<Model extends ILlmSchema.Model> =
  | AgenticaCallEvent<Model>
  | AgenticaCancelEvent<Model>
  | AgenticaDescribeEvent<Model>
  | AgenticaExecuteEvent<Model>
  | AgenticaInitializeEvent
  | AgenticaRequestEvent
  | AgenticaResponseEvent
  | AgenticaSelectEvent<Model>
  | AgenticaTextEvent;
export namespace AgenticaEvent {
  export type Type = AgenticaEvent<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    call: AgenticaCallEvent<Model>;
    cancel: AgenticaCancelEvent<Model>;
    describe: AgenticaDescribeEvent<Model>;
    execute: AgenticaExecuteEvent<Model>;
    initialize: AgenticaInitializeEvent;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
    select: AgenticaSelectEvent<Model>;
    text: AgenticaTextEvent;
  }
}
