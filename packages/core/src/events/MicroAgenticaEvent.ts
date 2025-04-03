import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import type { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import type { AgenticaTextEvent } from "./AgenticaTextEvent";
import type { AgenticaValidateEvent } from "./AgenticaValidateEvent";

export type MicroAgenticaEvent<Model extends ILlmSchema.Model> =
  | AgenticaCallEvent<Model>
  | AgenticaDescribeEvent<Model>
  | AgenticaExecuteEvent<Model>
  | AgenticaRequestEvent
  | AgenticaResponseEvent
  | AgenticaTextEvent
  | AgenticaValidateEvent<Model>;
export namespace MicroAgenticaEvent {
  export type Type = MicroAgenticaEvent<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    call: AgenticaCallEvent<Model>;
    describe: AgenticaDescribeEvent<Model>;
    execute: AgenticaExecuteEvent<Model>;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
    text: AgenticaTextEvent;
    validate: AgenticaValidateEvent<Model>;
  }
  export type Source = "call" | "describe";
}
