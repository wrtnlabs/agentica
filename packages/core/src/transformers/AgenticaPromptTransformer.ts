import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { AgenticaCancelPrompt } from "../prompts/AgenticaCancelPrompt";
import { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";
import { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import { AgenticaSelectPrompt } from "../prompts/AgenticaSelectPrompt";
import { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";

export function transform<Model extends ILlmSchema.Model>(props: {
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

export function transformText(props: {
  prompt: IAgenticaPromptJson.IText;
}): AgenticaTextPrompt {
  return new AgenticaTextPrompt(props.prompt);
}

export function transformSelect<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson.ISelect;
}): AgenticaSelectPrompt<Model> {
  return new AgenticaSelectPrompt({
    id: props.prompt.id,
    selections: props.prompt.selections.map(
      select =>
        new AgenticaOperationSelection({
          operation: findOperation({
            operations: props.operations,
            input: select.operation,
          }),
          reason: select.reason,
        }),
    ),
  });
}

export function transformCancel<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson.ICancel;
}): AgenticaCancelPrompt<Model> {
  return new AgenticaCancelPrompt({
    id: props.prompt.id,
    selections: props.prompt.selections.map(
      select =>
        new AgenticaOperationSelection({
          operation: findOperation({
            operations: props.operations,
            input: select.operation,
          }),
          reason: select.reason,
        }),
    ),
  });
}

export function transformExecute<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson.IExecute;
}): AgenticaExecutePrompt<Model> {
  return new AgenticaExecutePrompt({
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
    value: props.prompt.value as unknown as Record<string, unknown>,
  });
}

export function transformDescribe<Model extends ILlmSchema.Model>(props: {
  operations: Map<string, Map<string, AgenticaOperation<Model>>>;
  prompt: IAgenticaPromptJson.IDescribe;
}): AgenticaDescribePrompt<Model> {
  return new AgenticaDescribePrompt({
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
