import { ILlmSchema } from "@samchon/openapi";

import { AgenticaCallEvent } from "./AgenticaCallEvent";
import { AgenticaCancelEvent } from "./AgenticaCancelEvent";
import { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import { AgenticaInitializeEvent } from "./AgenticaInitializeEvent";
import { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import { AgenticaSelectEvent } from "./AgenticaSelectEvent";
import { AgenticaTextEvent } from "./AgenticaTextEvent";

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
  export type Mapper<Model extends ILlmSchema.Model> = {
    call: AgenticaCallEvent<Model>;
    cancel: AgenticaCancelEvent<Model>;
    describe: AgenticaDescribeEvent<Model>;
    execute: AgenticaExecuteEvent<Model>;
    initialize: AgenticaInitializeEvent;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
    select: AgenticaSelectEvent<Model>;
    text: AgenticaTextEvent;
  };
}
