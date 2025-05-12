import type { ILlmSchema, IValidation } from "@samchon/openapi";
import type OpenAI from "openai";

import { v4 } from "uuid";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaAssistantEvent } from "../events/AgenticaAssistantEvent";
import type { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import type { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import type { AgenticaDescribeEvent } from "../events/AgenticaDescribeEvent";
import type { AgenticaEventSource } from "../events/AgenticaEventSource";
import type { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import type { AgenticaInitializeEvent } from "../events/AgenticaInitializeEvent";
import type { AgenticaRequestEvent } from "../events/AgenticaRequestEvent";
import type { AgenticaResponseEvent } from "../events/AgenticaResponseEvent";
import type { AgenticaSelectEvent } from "../events/AgenticaSelectEvent";
import type { AgenticaUserEvent } from "../events/AgenticaUserEvent";
import type { AgenticaValidateEvent } from "../events/AgenticaValidateEvent";
import type { AgenticaUserContent } from "../histories";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import { createExecuteHistory, createSelectHistory, createUserHistory } from "./histories";

/* -----------------------------------------------------------
  FUNCTION SELECTS
----------------------------------------------------------- */
export function createInitializeEvent(): AgenticaInitializeEvent {
  const event: IAgenticaEventJson.IInitialize = {
    type: "initialize",
  };
  return {
    type: event.type,
    toJSON: () => event,
  };
}

export function createSelectEvent<Model extends ILlmSchema.Model>(props: {
  selection: AgenticaOperationSelection<Model>;
}): AgenticaSelectEvent<Model> {
  return {
    type: "select",
    selection: props.selection,
    toJSON: () => ({
      type: "select",
      selection: props.selection.toJSON(),
    }),
    toHistory: () => createSelectHistory({
      id: v4(),
      selections: [props.selection],
    }),
  };
}

export function createCancelEvent<Model extends ILlmSchema.Model>(props: {
  selection: AgenticaOperationSelection<Model>;
}): AgenticaCancelEvent<Model> {
  return {
    type: "cancel",
    selection: props.selection,
    toJSON: () => ({
      type: "cancel",
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
  return {
    type: "call",
    id: props.id,
    operation: props.operation,
    arguments: props.arguments,
    toJSON: () => ({
      type: "call",
      id: props.id,
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
  return {
    type: "validate",
    id: props.id,
    operation: props.operation,
    result: props.result,
    toJSON: () => ({
      type: "validate",
      id: props.id,
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
}): AgenticaExecuteEvent<Model> {
  return {
    type: "execute",
    protocol: props.operation.protocol as "class",
    id: props.id,
    operation: props.operation as AgenticaOperation.Class<Model>,
    arguments: props.arguments,
    value: props.value as any,
    toJSON: () => ({
      type: "execute",
      protocol: props.operation.protocol as "class",
      id: props.id,
      operation: props.operation.toJSON(),
      arguments: props.arguments,
      value: props.value,
    }),
    toHistory: () =>
      createExecuteHistory(props) as AgenticaExecuteHistory.Class<Model>,
  };
}

/* -----------------------------------------------------------
  CONTENTS
----------------------------------------------------------- */
export function createUserEvent(props: {
  contents: Array<AgenticaUserContent>;
}): AgenticaUserEvent {
  return {
    type: "user",
    contents: props.contents,
    toJSON: () => ({
      type: "user",
      contents: props.contents,
    }),
    toHistory: () => createUserHistory({
      contents: props.contents,
    }),
  };
}

export function creatAssistantEvent(props: {
  stream: AsyncGenerator<string, undefined, undefined>;
  done: () => boolean;
  get: () => string;
  join: () => Promise<string>;
}): AgenticaAssistantEvent {
  return {
    type: "assistant",
    stream: props.stream,
    join: props.join,
    toJSON: () => ({
      type: "assistant",
      done: props.done(),
      text: props.get(),
    }),
    toHistory: () => ({
      type: "assistant",
      text: props.get(),
      toJSON: () => ({
        type: "assistant",
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
  return {
    type: "describe",
    executes: props.executes,
    stream: props.stream,
    join: props.join,
    toJSON: () => ({
      type: "describe",
      executes: props.executes.map(execute => execute.toJSON()),
      done: props.done(),
      text: props.get(),
    }),
    toHistory: () => ({
      type: "describe",
      executes: props.executes,
      text: props.get(),
      toJSON: () => ({
        type: "describe",
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
  return {
    type: "request",
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
  return {
    type: "response",
    source: props.source,
    body: props.body,
    options: props.options,
    stream: props.stream,
    join: props.join,
  };
}
