import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantMessageEvent } from "./AgenticaAssistantMessageEvent";
import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import type { AgenticaUserMessageEvent } from "./AgenticaUserMessageEvent";
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
  | AgenticaUserMessageEvent
  | AgenticaAssistantMessageEvent
  | AgenticaCallEvent<Model>
  | AgenticaExecuteEvent<Model>
  | AgenticaDescribeEvent<Model>
  | AgenticaRequestEvent
  | AgenticaResponseEvent
  | AgenticaValidateEvent<Model>;
export namespace MicroAgenticaEvent {
  export type Type = MicroAgenticaEvent<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    userMessage: AgenticaUserMessageEvent;
    assistantMessage: AgenticaAssistantMessageEvent;
    call: AgenticaCallEvent<Model>;
    execute: AgenticaExecuteEvent<Model>;
    describe: AgenticaDescribeEvent<Model>;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
    validate: AgenticaValidateEvent<Model>;
  }
  export type Source = "call" | "describe";
}
