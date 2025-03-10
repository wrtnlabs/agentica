import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperation } from "../context/AgenticaOperation";
import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import { AgenticaDescribeEvent } from "../events/AgenticaDescribeEvent";
import { AgenticaEvent } from "../events/AgenticaEvent";
import { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import { AgenticaInitializeEvent } from "../events/AgenticaInitializeEvent";
import { AgenticaRequestEvent } from "../events/AgenticaRequestEvent";
import { AgenticaSelectEvent } from "../events/AgenticaSelectEvent";
import { AgenticaTextEvent } from "../events/AgenticaTextEvent";
import { StreamUtil } from "../internal/StreamUtil";
import { IAgenticaEventJson } from "../json/IAgenticaEventJson";

export namespace AgenticaEventTransformer {
  export const transform = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    event: IAgenticaEventJson;
  }): AgenticaEvent<Model> => {
    if (props.event.type === "call")
      return transformCall({
        operations: props.operations,
        event: props.event,
      });
    else if (props.event.type === "cancel")
      return transformCancel({
        operations: props.operations,
        event: props.event,
      });
    else if (props.event.type === "describe")
      return transformDescribe({
        operations: props.operations,
        event: props.event,
      });
    else if (props.event.type === "execute")
      return transformExecute({
        operations: props.operations,
        event: props.event,
      });
    else if (props.event.type === "initialize") return transformInitialize();
    else if (props.event.type === "request")
      return transformRequest({
        event: props.event,
      });
    else if (props.event.type === "select")
      return transformSelect({
        operations: props.operations,
        event: props.event,
      });
    else if (props.event.type === "text")
      return transformText({
        event: props.event,
      });
    else throw new Error("Unknown event type");
  };

  export const transformCall = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    event: IAgenticaEventJson.ICall;
  }): AgenticaCallEvent<Model> =>
    new AgenticaCallEvent({
      id: props.event.id,
      operation: findOperation({
        operations: props.operations,
        input: props.event.operation,
      }),
      arguments: props.event.arguments,
    });

  export const transformCancel = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    event: IAgenticaEventJson.ICancel;
  }): AgenticaCancelEvent<Model> =>
    new AgenticaCancelEvent({
      selection: new AgenticaOperationSelection({
        operation: findOperation({
          operations: props.operations,
          input: props.event.selection.operation,
        }),
        reason: props.event.selection.reason,
      }),
    });

  export const transformDescribe = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    event: IAgenticaEventJson.IDescribe;
  }): AgenticaDescribeEvent<Model> =>
    new AgenticaDescribeEvent({
      executes: props.event.executes.map((next) =>
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

  export const transformExecute = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    event: IAgenticaEventJson.IExecute;
  }): AgenticaExecuteEvent<Model> =>
    new AgenticaExecuteEvent({
      id: props.event.id,
      operation: findOperation({
        operations: props.operations,
        input: props.event.operation,
      }),
      arguments: props.event.arguments,
      value: props.event.value,
    });

  export const transformInitialize = (): AgenticaInitializeEvent =>
    new AgenticaInitializeEvent();

  export const transformRequest = (props: {
    event: IAgenticaEventJson.IRequest;
  }): AgenticaRequestEvent => new AgenticaRequestEvent(props.event);

  export const transformSelect = <Model extends ILlmSchema.Model>(props: {
    operations: Map<string, Map<string, AgenticaOperation<Model>>>;
    event: IAgenticaEventJson.ISelect;
  }): AgenticaSelectEvent<Model> =>
    new AgenticaSelectEvent({
      selection: new AgenticaOperationSelection({
        operation: findOperation({
          operations: props.operations,
          input: props.event.selection.operation,
        }),
        reason: props.event.selection.reason,
      }),
    });

  export const transformText = (props: {
    event: IAgenticaEventJson.IText;
  }): AgenticaTextEvent =>
    new AgenticaTextEvent({
      role: props.event.role,
      stream: StreamUtil.to(props.event.text),
      done: () => true,
      get: () => props.event.text,
      join: async () => props.event.text,
    });
}

const findOperation = <Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  input: {
    controller: string;
    function: string;
  };
}): AgenticaOperation<Model> => {
  const found: AgenticaOperation<Model> | undefined = props.operations
    .get(props.input.controller)
    ?.get(props.input.function);
  if (found === undefined)
    throw new Error(
      `No operation found: (controller: ${props.input.controller}, function: ${props.input.function})`,
    );
  return found;
};
