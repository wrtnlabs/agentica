import type { ILlmSchema, IValidation } from "@samchon/openapi";
import type OpenAI from "openai";
import type { tags } from "typia";

import { v4 } from "uuid";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaAssistantMessageEvent } from "../events/AgenticaAssistantMessageEvent";
import type { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import type { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import type { AgenticaDescribeEvent } from "../events/AgenticaDescribeEvent";
import type { AgenticaEventSource } from "../events/AgenticaEventSource";
import type { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import type { AgenticaInitializeEvent } from "../events/AgenticaInitializeEvent";
import type { AgenticaRequestEvent } from "../events/AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "../events/AgenticaResponseEvent";
import type { AgenticaSelectEvent } from "../events/AgenticaSelectEvent";
import type { AgenticaUserMessageEvent } from "../events/AgenticaUserMessageEvent";
import type { AgenticaValidateEvent } from "../events/AgenticaValidateEvent";
import type { AgenticaUserMessageContent } from "../histories";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import {
  createExecuteHistory,
  createSelectHistory,
  createUserMessageHistory,
} from "./histories";

/* -----------------------------------------------------------
  FUNCTION SELECTS
----------------------------------------------------------- */
export function createInitializeEvent(): AgenticaInitializeEvent {
  const event: IAgenticaEventJson.IInitialize = {
    id: v4(),
    type: "initialize",
    created_at: new Date().toISOString(),
  };
  return {
    id: event.id,
    type: event.type,
    created_at: event.created_at,
    toJSON: () => event,
  };
}

export function createSelectEvent<Model extends ILlmSchema.Model>(props: {
  selection: AgenticaOperationSelection<Model>;
}): AgenticaSelectEvent<Model> {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "select",
    id,
    created_at,
    selection: props.selection,
    toJSON: () => ({
      type: "select",
      id,
      created_at,
      selection: props.selection.toJSON(),
    }),
    toHistory: () => createSelectHistory({
      id,
      created_at,
      selection: props.selection,
    }),
  };
}

export function createCancelEvent<Model extends ILlmSchema.Model>(props: {
  selection: AgenticaOperationSelection<Model>;
}): AgenticaCancelEvent<Model> {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "cancel",
    id,
    created_at,
    selection: props.selection,
    toJSON: () => ({
      type: "cancel",
      id,
      created_at,
      selection: props.selection.toJSON(),
    }),
  };
}

/* -----------------------------------------------------------
  FUNCTION CALLS
----------------------------------------------------------- */
export function createCallEvent<Model extends ILlmSchema.Model>(props: {
  id: string;
  operation: AgenticaOperation<Model>;
  arguments: Record<string, any>;
}): AgenticaCallEvent<Model> {
  const created_at: string = new Date().toISOString();
  return {
    type: "call",
    id: props.id,
    created_at,
    operation: props.operation,
    arguments: props.arguments,
    toJSON: () => ({
      type: "call",
      id: props.id,
      created_at,
      operation: props.operation.toJSON(),
      arguments: props.arguments,
    }),
  };
}

export function createValidateEvent<Model extends ILlmSchema.Model>(props: {
  id: string;
  operation: AgenticaOperation<Model>;
  result: IValidation.IFailure;
}): AgenticaValidateEvent<Model> {
  const created_at: string = new Date().toISOString();
  return {
    type: "validate",
    id: props.id,
    created_at,
    operation: props.operation,
    result: props.result,
    toJSON: () => ({
      type: "validate",
      id: props.id,
      created_at,
      operation: props.operation.toJSON(),
      result: props.result,
    }),
  };
}

export function createExecuteEvent<Model extends ILlmSchema.Model>(props: {
  id: string;
  operation: AgenticaOperation<Model>;
  arguments: Record<string, unknown>;
  value: unknown;
  created_at: string & tags.Format<"date-time">;
}): AgenticaExecuteEvent<Model> {
  return {
    type: "execute",
    protocol: props.operation.protocol as "class",
    id: props.id,
    operation: props.operation as AgenticaOperation.Class<Model>,
    arguments: props.arguments,
    value: props.value as any,
    created_at: props.created_at,
    toJSON: () => ({
      type: "execute",
      protocol: props.operation.protocol as "class",
      id: props.id,
      operation: props.operation.toJSON(),
      arguments: props.arguments,
      value: props.value,
      created_at: props.created_at,
    }),
    toHistory: () =>
      createExecuteHistory(props) as AgenticaExecuteHistory.Class<Model>,
  };
}

/* -----------------------------------------------------------
  CONTENTS
----------------------------------------------------------- */
export function createUserMessageEvent(props: {
  contents: Array<AgenticaUserMessageContent>;
}): AgenticaUserMessageEvent {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "userMessage",
    id,
    created_at,
    contents: props.contents,
    toJSON: () => ({
      type: "userMessage",
      id,
      created_at,
      contents: props.contents,
    }),
    toHistory: () => createUserMessageHistory({
      id,
      created_at,
      contents: props.contents,
    }),
  };
}

export function creatAssistantMessageEvent(props: {
  stream: AsyncGenerator<string, undefined, undefined>;
  done: () => boolean;
  get: () => string;
  join: () => Promise<string>;
}): AgenticaAssistantMessageEvent {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "assistantMessage",
    id,
    created_at,
    stream: props.stream,
    join: props.join,
    toJSON: () => ({
      type: "assistantMessage",
      id,
      created_at,
      done: props.done(),
      text: props.get(),
    }),
    toHistory: () => ({
      type: "assistantMessage",
      id,
      created_at,
      text: props.get(),
      toJSON: () => ({
        type: "assistantMessage",
        id,
        created_at,
        text: props.get(),
      }),
    }),
  };
}

export function createDescribeEvent<Model extends ILlmSchema.Model>(props: {
  executes: AgenticaExecuteHistory<Model>[];
  stream: AsyncGenerator<string, undefined, undefined>;
  done: () => boolean;
  get: () => string;
  join: () => Promise<string>;
}): AgenticaDescribeEvent<Model> {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "describe",
    id,
    created_at,
    executes: props.executes,
    stream: props.stream,
    join: props.join,
    toJSON: () => ({
      type: "describe",
      id,
      created_at,
      executes: props.executes.map(execute => execute.toJSON()),
      done: props.done(),
      text: props.get(),
    }),
    toHistory: () => ({
      type: "describe",
      id,
      created_at,
      executes: props.executes,
      text: props.get(),
      toJSON: () => ({
        type: "describe",
        id,
        created_at,
        executes: props.executes.map(execute => execute.toJSON()),
        text: props.get(),
      }),
    }),
  };
}

/* -----------------------------------------------------------
  API REQUESTS
----------------------------------------------------------- */
export function createRequestEvent(props: {
  source: AgenticaEventSource;
  body: OpenAI.ChatCompletionCreateParamsStreaming;
  options?: OpenAI.RequestOptions | undefined;
}): AgenticaRequestEvent {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "request",
    id,
    created_at,
    source: props.source,
    body: props.body,
    options: props.options,
  };
}

export function createResponseEvent(props: {
  source: AgenticaEventSource;
  body: OpenAI.ChatCompletionCreateParamsStreaming;
  options?: OpenAI.RequestOptions | undefined;
  stream: AsyncGenerator<OpenAI.ChatCompletionChunk, undefined, undefined>;
  join: () => Promise<OpenAI.ChatCompletion>;
}): AgenticaResponseEvent {
  const id: string = v4();
  const created_at: string = new Date().toISOString();
  return {
    type: "response",
    id,
    created_at,
    source: props.source,
    body: props.body,
    options: props.options,
    stream: props.stream,
    join: props.join,
  };
}
