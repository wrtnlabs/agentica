import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantEvent } from "./AgenticaAssistantEvent";
import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import type { AgenticaUserEvent } from "./AgenticaUserEvent";
import type { AgenticaValidateEvent } from "./AgenticaValidateEvent";

/**
 * Micro Agentica agent event.
 *
 * `MicroAgenticaEvent` is an union type of all possible events that
 * can be emitted by the AI chatbot of the {@link MicroAgentica} class.
 *
 * You can discriminate the subtype by checking the {@link type} property.
 *
 * @author Samchon
 */
export type MicroAgenticaEvent<Model extends ILlmSchema.Model> =
  | AgenticaUserEvent
  | AgenticaAssistantEvent
  | AgenticaCallEvent<Model>
  | AgenticaExecuteEvent<Model>
  | AgenticaDescribeEvent<Model>
  | AgenticaRequestEvent
  | AgenticaResponseEvent
  | AgenticaValidateEvent<Model>;
export namespace MicroAgenticaEvent {
  export type Type = MicroAgenticaEvent<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    user: AgenticaUserEvent;
    assistant: AgenticaAssistantEvent;
    call: AgenticaCallEvent<Model>;
    execute: AgenticaExecuteEvent<Model>;
    describe: AgenticaDescribeEvent<Model>;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
    validate: AgenticaValidateEvent<Model>;
  }
  export type Source = "call" | "describe";
}
