import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import type { AgenticaTextEvent } from "./AgenticaTextEvent";
import type { AgenticaUserInputEvent } from "./AgenticaUserInputEvent";
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
  | AgenticaCallEvent<Model>
  | AgenticaDescribeEvent<Model>
  | AgenticaExecuteEvent<Model>
  | AgenticaRequestEvent
  | AgenticaResponseEvent
  | AgenticaTextEvent
  | AgenticaValidateEvent<Model>
  | AgenticaUserInputEvent;
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
    user_input: AgenticaUserInputEvent;
  }
  export type Source = "call" | "describe";
}
