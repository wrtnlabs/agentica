import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaUserHistory } from "../histories";
import type { AgenticaAssistantHistory } from "../histories/AgenticaAssistantHistory";
import type { AgenticaCancelHistory } from "../histories/AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import { createAssistantHistory, createCancelHistory, createDescribeHistory, createExecuteHistory, createSelectHistory, createUserHistory } from "../factory/histories";
import { createOperationSelection } from "../factory/operations";

/**
 * @internal
 */
export function transformHistory<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  history: IAgenticaHistoryJson;
}): AgenticaHistory<Model> {
  // USER
  if (props.history.type === "user") {
    return transformUser({
      history: props.history,
    });
  }
  // ASSISTANT
  else if (props.history.type === "assistant") {
    return transformAssistant({
      history: props.history,
    });
  }
  // SELECT & CANCEL
  else if (props.history.type === "select") {
    return transformSelect({
      operations: props.operations,
      history: props.history,
    });
  }
  else if (props.history.type === "cancel") {
    return transformCancel({
      operations: props.operations,
      history: props.history,
    });
  }
  // EXECUTE
  else if (props.history.type === "execute") {
    return transformExecute({
      operations: props.operations,
      history: props.history,
    });
  }
  else if (props.history.type === "describe") {
    return transformDescribe({
      operations: props.operations,
      history: props.history,
    });
  }
  throw new Error("Invalid prompt type.");
}

function transformAssistant(props: {
  history: IAgenticaHistoryJson.IAssistant;
}): AgenticaAssistantHistory {
  return createAssistantHistory(props.history);
}

function transformUser(props: {
  history: IAgenticaHistoryJson.IUser;
}): AgenticaUserHistory {
  return createUserHistory(props.history);
}

function transformSelect<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  history: IAgenticaHistoryJson.ISelect;
}): AgenticaSelectHistory<Model> {
  return createSelectHistory({
    id: props.history.id,
    selections: props.history.selections.map(
      select =>
        createOperationSelection({
          operation: findOperation({
            operations: props.operations,
            input: select.operation,
          }),
          reason: select.reason,
        }),
    ),
  });
}

function transformCancel<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  history: IAgenticaHistoryJson.ICancel;
}): AgenticaCancelHistory<Model> {
  return createCancelHistory({
    id: props.history.id,
    selections: props.history.selections.map(
      select =>
        createOperationSelection({
          operation: findOperation({
            operations: props.operations,
            input: select.operation,
          }),
          reason: select.reason,
        }),
    ),
  });
}

function transformExecute<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  history: IAgenticaHistoryJson.IExecute;
}): AgenticaExecuteHistory<Model> {
  return createExecuteHistory({
    id: props.history.id,
    operation: findOperation({
      operations: props.operations,
      input: props.history.operation,
    }),
    arguments: props.history.arguments,
    /**
     * @TODO fix it
     * The property and value have a type mismatch, but it works.
     */
    value: props.history.value as Record<string, unknown>,
  });
}

function transformDescribe<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  history: IAgenticaHistoryJson.IDescribe;
}): AgenticaDescribeHistory<Model> {
  return createDescribeHistory({
    text: props.history.text,
    executes: props.history.executes.map(next =>
      transformExecute({
        operations: props.operations,
        history: next,
      }),
    ),
  });
}

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
