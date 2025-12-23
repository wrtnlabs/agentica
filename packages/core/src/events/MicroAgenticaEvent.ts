import type { AgenticaAssistantMessageEvent } from "./AgenticaAssistantMessageEvent";
import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaJsonParseErrorEvent } from "./AgenticaJsonParseErrorEvent";
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
export type MicroAgenticaEvent =
  | AgenticaUserMessageEvent
  | AgenticaAssistantMessageEvent
  | AgenticaCallEvent
  | AgenticaExecuteEvent
  | AgenticaDescribeEvent
  | AgenticaRequestEvent
  | AgenticaResponseEvent
  | AgenticaValidateEvent
  | AgenticaJsonParseErrorEvent;
export namespace MicroAgenticaEvent {
  export type Type = MicroAgenticaEvent["type"];
  export interface Mapper {
    userMessage: AgenticaUserMessageEvent;
    assistantMessage: AgenticaAssistantMessageEvent;
    call: AgenticaCallEvent;
    execute: AgenticaExecuteEvent;
    describe: AgenticaDescribeEvent;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
    validate: AgenticaValidateEvent;
    jsonParseError: AgenticaJsonParseErrorEvent;
  }
  export type Source = "call" | "describe";
}
