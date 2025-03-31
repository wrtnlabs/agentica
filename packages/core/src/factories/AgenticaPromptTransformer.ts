import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import type { AgenticaSelectPrompt } from "../prompts/AgenticaSelectPrompt";
import type { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import type { AgenticaCancelPrompt } from "../prompts/AgenticaCancelPrompt";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";

import { AgenticaPromptFactory } from "./AgenticaPromptFactory";
import { AgenticaOperationFactory } from "./AgenticaOperationFactory";

function transform<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson;
}): AgenticaPrompt<Model> {
  // TEXT
  if (props.prompt.type === "text") {
    return transformText({
      prompt: props.prompt,
    });
  }
  // SELECT & CANCEL
  else if (props.prompt.type === "select") {
    return transformSelect({
      operations: props.operations,
      prompt: props.prompt,
    });
  }
  else if (props.prompt.type === "cancel") {
    return transformCancel({
      operations: props.operations,
      prompt: props.prompt,
    });
  }
  // EXECUTE
  else if (props.prompt.type === "execute") {
    return transformExecute({
      operations: props.operations,
      prompt: props.prompt,
    });
  }
  else if (props.prompt.type === "describe") {
    return transformDescribe({
      operations: props.operations,
      prompt: props.prompt,
    });
  }
  throw new Error("Invalid prompt type.");
}

function transformText(props: {
  prompt: IAgenticaPromptJson.IText;
}): AgenticaTextPrompt {
  return AgenticaPromptFactory.createTextPrompt(props.prompt);
}

function transformSelect<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson.ISelect;
}): AgenticaSelectPrompt<Model> {
  return AgenticaPromptFactory.createSelectPrompt({
    id: props.prompt.id,
    selections: props.prompt.selections.map(
      select =>
        AgenticaOperationFactory.createOperationSelection({
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
  prompt: IAgenticaPromptJson.ICancel;
}): AgenticaCancelPrompt<Model> {
  return AgenticaPromptFactory.createCancelPrompt({
    id: props.prompt.id,
    selections: props.prompt.selections.map(
      select =>
        AgenticaOperationFactory.createOperationSelection({
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
  prompt: IAgenticaPromptJson.IExecute;
}): AgenticaExecutePrompt<Model> {
  return AgenticaPromptFactory.createExecutePrompt({
    id: props.prompt.id,
    operation: findOperation({
      operations: props.operations,
      input: props.prompt.operation,
    }),
    arguments: props.prompt.arguments,
    /**
     * @TODO fix it
     * The property and value have a type mismatch, but it works.
     */
    value: props.prompt.value as Record<string, unknown>,
  });
}

function transformDescribe<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson.IDescribe;
}): AgenticaDescribePrompt<Model> {
  return AgenticaPromptFactory.createDescribePrompt({
    text: props.prompt.text,
    executes: props.prompt.executes.map(next =>
      transformExecute({
        operations: props.operations,
        prompt: next,
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
