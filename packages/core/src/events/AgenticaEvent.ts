import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaAssistantMessageEvent } from "./AgenticaAssistantMessageEvent";
import type { AgenticaCallEvent } from "./AgenticaCallEvent";
import type { AgenticaCancelEvent } from "./AgenticaCancelEvent";
import type { AgenticaDescribeEvent } from "./AgenticaDescribeEvent";
import type { AgenticaExecuteEvent } from "./AgenticaExecuteEvent";
import type { AgenticaInitializeEvent } from "./AgenticaInitializeEvent";
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
export type AgenticaEvent<Model extends ILlmSchema.Model> =
  | AgenticaUserMessageEvent
  | AgenticaAssistantMessageEvent
  | AgenticaInitializeEvent
  | AgenticaSelectEvent<Model>
  | AgenticaCallEvent<Model>
  | AgenticaCancelEvent<Model>
  | AgenticaExecuteEvent<Model>
  | AgenticaDescribeEvent<Model>
  | AgenticaValidateEvent<Model>
  | AgenticaRequestEvent
  | AgenticaResponseEvent;
export namespace AgenticaEvent {
  export type Type = AgenticaEvent<any>["type"];
  export interface Mapper<Model extends ILlmSchema.Model> {
    userMessage: AgenticaUserMessageEvent;
    assistantMessage: AgenticaAssistantMessageEvent;
    select: AgenticaSelectEvent<Model>;
    initialize: AgenticaInitializeEvent;
    call: AgenticaCallEvent<Model>;
    cancel: AgenticaCancelEvent<Model>;
    execute: AgenticaExecuteEvent<Model>;
    describe: AgenticaDescribeEvent<Model>;
    validate: AgenticaValidateEvent<Model>;
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
