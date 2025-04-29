import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import type { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import type { AgenticaDescribeEvent } from "../events/AgenticaDescribeEvent";
import type { AgenticaEvent } from "../events/AgenticaEvent";
import type { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import type { AgenticaInitializeEvent } from "../events/AgenticaInitializeEvent";
import type { AgenticaRequestEvent } from "../events/AgenticaRequestEvent";
import type { AgenticaSelectEvent } from "../events/AgenticaSelectEvent";
import type { AgenticaTextEvent } from "../events/AgenticaTextEvent";
import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";

import { createCallEvent, createCancelEvent, createDescribeEvent, createExecuteEvent, createInitializeEvent, createRequestEvent, createSelectEvent, createTextEvent } from "../factory/events";
import { createOperationSelection } from "../factory/operations";
import { toAsyncGenerator } from "../utils/StreamUtil";

function findOperation<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  input: {
    controller: string;
    function: string;
  };
}): AgenticaOperation<Model> {
  const found: AgenticaOperation<Model> | undefined = props.operations
    .get(props.input.controller)
    ?.get(props.input.function);
  if (found === undefined) {
    throw new Error(
      `No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`,
    );
  }
  return found;
}

function transform<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson;
}): AgenticaEvent<Model> {
  if (props.event.type === "call") {
    return transformCall({
      operations: props.operations,
      event: props.event,
    });
  }
  else if (props.event.type === "cancel") {
    return transformCancel({
      operations: props.operations,
      event: props.event,
    });
  }
  else if (props.event.type === "describe") {
    return transformDescribe({
      operations: props.operations,
      event: props.event,
    });
  }
  else if (props.event.type === "execute") {
    return transformExecute({
      operations: props.operations,
      event: props.event,
    });
  }
  else if (props.event.type === "initialize") {
    return transformInitialize();
  }
  else if (props.event.type === "request") {
    return transformRequest({
      event: props.event,
    });
  }
  else if (props.event.type === "select") {
    return transformSelect({
      operations: props.operations,
      event: props.event,
    });
  }
  else if (props.event.type === "text") {
    return transformText({
      event: props.event,
    });
  }
  else { throw new Error("Unknown event type"); }
}

function transformCall<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.ICall;
}): AgenticaCallEvent<Model> {
  return createCallEvent({
    id: props.event.id,
    operation: findOperation({
      operations: props.operations,
      input: props.event.operation,
    }),
    arguments: props.event.arguments,
  });
}

export function transformCancel<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.ICancel;
}): AgenticaCancelEvent<Model> {
  return createCancelEvent({
    selection: createOperationSelection({
      operation: findOperation({
        operations: props.operations,
        input: props.event.selection.operation,
      }),
      reason: props.event.selection.reason,
    }),
  });
}

function transformDescribe<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.IDescribe;
}): AgenticaDescribeEvent<Model> {
  return createDescribeEvent({
    executes: props.event.executes.map(next =>
      transformExecute({
        operations: props.operations,
        event: next,
      }),
    ),
    stream: toAsyncGenerator(props.event.text),
    done: () => true,
    get: () => props.event.text,
    join: async () => props.event.text,
  });
}

function transformExecute<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.IExecute;
}): AgenticaExecuteEvent<Model> {
  return createExecuteEvent({
    id: props.event.id,
    operation: findOperation({
      operations: props.operations,
      input: props.event.operation,
    }),
    arguments: props.event.arguments,
    value: props.event.value,
  });
}

function transformInitialize(): AgenticaInitializeEvent {
  return createInitializeEvent();
}

function transformRequest(props: {
  event: IAgenticaEventJson.IRequest;
}): AgenticaRequestEvent {
  return createRequestEvent(props.event);
}

function transformSelect<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.ISelect;
}): AgenticaSelectEvent<Model> {
  return createSelectEvent({
    selection: createOperationSelection({
      operation: findOperation({
        operations: props.operations,
        input: props.event.selection.operation,
      }),
      reason: props.event.selection.reason,
    }),
  });
}

function transformText(props: {
  event: IAgenticaEventJson.IText;
}): AgenticaTextEvent {
  return createTextEvent({
    role: props.event.role,
    stream: toAsyncGenerator(props.event.text),
    done: () => true,
    get: () => props.event.text,
    join: async () => props.event.text,
  });
}

export const AgenticaEventTransformer = {
  transform,
  transformCall,
  transformCancel,
  transformDescribe,
  transformExecute,
  transformInitialize,
  transformRequest,
  transformSelect,
  transformText,
  findOperation,
};
