import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaEvent } from "../events/AgenticaEvent";
import type { IAgenticaEventJson } from "../json";
import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import { AgenticaDescribeEvent } from "../events/AgenticaDescribeEvent";
import { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import { AgenticaInitializeEvent } from "../events/AgenticaInitializeEvent";
import { AgenticaRequestEvent } from "../events/AgenticaRequestEvent";
import { AgenticaSelectEvent } from "../events/AgenticaSelectEvent";
import { AgenticaTextEvent } from "../events/AgenticaTextEvent";
import { StreamUtil } from "../internal/StreamUtil";

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

export function transform<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.Event;
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

export function transformCall<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.ICall;
}): AgenticaCallEvent<Model> {
  return new AgenticaCallEvent({
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
  return new AgenticaCancelEvent({
    selection: new AgenticaOperationSelection({
      operation: findOperation({
        operations: props.operations,
        input: props.event.selection.operation,
      }),
      reason: props.event.selection.reason,
    }),
  });
}

export function transformDescribe<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.IDescribe;
}): AgenticaDescribeEvent<Model> {
  return new AgenticaDescribeEvent({
    executes: props.event.executes.map(next =>
      transformExecute({
        operations: props.operations,
        event: next,
      }),
    ),
    stream: StreamUtil.to(props.event.text),
    done: () => true,
    get: () => props.event.text,
    join: async () => props.event.text,
  });
}

export function transformExecute<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.IExecute;
}): AgenticaExecuteEvent<Model> {
  return new AgenticaExecuteEvent({
    id: props.event.id,
    operation: findOperation({
      operations: props.operations,
      input: props.event.operation,
    }),
    /**
     * @TODO remove `as`
     */
    arguments: props.event.arguments as Record<string, any>,
    value: props.event.value,
  });
}

export function transformInitialize(): AgenticaInitializeEvent {
  return new AgenticaInitializeEvent();
}

export function transformRequest(props: {
  event: IAgenticaEventJson.IRequest;
}): AgenticaRequestEvent {
  return new AgenticaRequestEvent(props.event);
}

export function transformSelect<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  event: IAgenticaEventJson.ISelect;
}): AgenticaSelectEvent<Model> {
  return new AgenticaSelectEvent({
    selection: new AgenticaOperationSelection({
      operation: findOperation({
        operations: props.operations,
        input: props.event.selection.operation,
      }),
      reason: props.event.selection.reason,
    }),
  });
}

export function transformText(props: {
  event: IAgenticaEventJson.IText;
}): AgenticaTextEvent {
  return new AgenticaTextEvent({
    role: props.event.role,
    stream: StreamUtil.to(props.event.text),
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
