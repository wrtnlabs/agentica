import type { AgenticaAssistantMessageEvent } from "./AgenticaAssistantMessageEvent";
import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaCancelEvent } from "./AgenticaCancelEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaInitializeEvent } from "./AgenticaInitializeEvent";
import type { AgenticaJsonParseErrorEvent } from "./AgenticaJsonParseErrorEvent";
import type { AgenticaRequestEvent } from "./AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "./AgenticaResponseEvent";
import type { AgenticaSelectEvent } from "./AgenticaSelectEvent";
import type { AgenticaUserMessageEvent } from "./AgenticaUserMessageEvent";
import type { AgenticaValidateEvent } from "./AgenticaValidateEvent";

/**
 * Agentica agent event.
 *
 * `AgenticaEvent` is an union type of all possible events that can
 * be emitted by the AI chatbot of the {@link Agentica} class.
 *
 * You can discriminate the subtype by checking the {@link type} property.
 *
 * @author Samchon
 */
export type AgenticaEvent =
  | AgenticaUserMessageEvent
  | AgenticaAssistantMessageEvent
  | AgenticaInitializeEvent
  | AgenticaSelectEvent
  | AgenticaCallEvent
  | AgenticaCancelEvent
  | AgenticaExecuteEvent
  | AgenticaDescribeEvent
  | AgenticaValidateEvent
  | AgenticaJsonParseErrorEvent
  | AgenticaRequestEvent
  | AgenticaResponseEvent;
export namespace AgenticaEvent {
  export type Type = AgenticaEvent["type"];
  export interface Mapper {
    userMessage: AgenticaUserMessageEvent;
    assistantMessage: AgenticaAssistantMessageEvent;
    select: AgenticaSelectEvent;
    initialize: AgenticaInitializeEvent;
    call: AgenticaCallEvent;
    cancel: AgenticaCancelEvent;
    execute: AgenticaExecuteEvent;
    describe: AgenticaDescribeEvent;
    validate: AgenticaValidateEvent;
    jsonParseError: AgenticaJsonParseErrorEvent;
    request: AgenticaRequestEvent;
    response: AgenticaResponseEvent;
  }
  export type Source =
    | "initialize"
    | "select"
    | "cancel"
    | "call"
    | "describe";
}
