import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaCancelHistory } from "../histories/AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { AgenticaTextHistory } from "../histories/AgenticaTextHistory";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

import { createCancelHistory, createDescribeHistory, createExecuteHistory, createSelectHistory, createTextHistory } from "../factory/histories";
import { createOperationSelection } from "../factory/operations";

function transform<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  history: IAgenticaHistoryJson;
}): AgenticaHistory<Model> {
  // TEXT
  if (props.history.type === "text") {
    return transformText({
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

function transformText(props: {
  history: IAgenticaHistoryJson.IText;
}): AgenticaTextHistory {
  return createTextHistory(props.history);
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

export const AgenticaPromptTransformer = {
  transform,
  transformText,
  transformSelect,
  transformCancel,
  transformExecute,
  transformDescribe,
};
