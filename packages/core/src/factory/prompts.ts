import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import type { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaSelectPrompt } from "../prompts/AgenticaSelectPrompt";
import type { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";
import type { AgenticaOperation } from "../context/AgenticaOperation";

/* -----------------------------------------------------------
    TEXT PROMPTS
  ----------------------------------------------------------- */
export function createTextPrompt<Role extends "assistant" | "user" = "assistant" | "user">(props: {
  role: Role;
  text: string;
}): AgenticaTextPrompt<Role> {
  const prompt: IAgenticaPromptJson.IText<Role> = {
    type: "text",
    role: props.role,
    text: props.text,
  };
  return {
    ...prompt,
    toJSON: () => prompt,
  };
}

export function createDescribePrompt<Model extends ILlmSchema.Model>(props: {
  executes: AgenticaExecutePrompt<Model>[];
  text: string;
}): AgenticaDescribePrompt<Model> {
  return {
    type: "describe",
    text: props.text,
    executes: props.executes,
    toJSON: () => ({
      type: "describe",
      text: props.text,
      executes: props.executes.map(execute => execute.toJSON()),
    }),
  };
}

/* -----------------------------------------------------------
    FUNCTION CALLING PROMPTS
  ----------------------------------------------------------- */
export function createSelectPrompt<Model extends ILlmSchema.Model>(props: {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}): AgenticaSelectPrompt<Model> {
  return {
    type: "select",
    id: props.id,
    selections: props.selections,
    toJSON: () => ({
      type: "select",
      id: props.id,
      selections: props.selections.map(selection => selection.toJSON()),
    }),
  };
}

export function createCancelPrompt<Model extends ILlmSchema.Model>(props: {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}): AgenticaCancelPrompt<Model> {
  return {
    type: "cancel",
    id: props.id,
    selections: props.selections,
    toJSON: () => ({
      type: "cancel",
      id: props.id,
      selections: props.selections.map(selection => selection.toJSON()),
    }),
  };
}

export function createExecutePrompt<
  Model extends ILlmSchema.Model,
>(props: {
  id: string;
  operation: AgenticaOperation<Model>;
  arguments: Record<string, any>;
  value: unknown;
}): AgenticaExecutePrompt<Model> {
  return {
    type: "execute",
    protocol: props.operation.protocol as "class",
    id: props.id,
    operation: props.operation as AgenticaOperation.Class<Model>,
    arguments: props.arguments,
    value: props.value,
    toJSON: () => ({
      type: "execute",
      protocol: props.operation.protocol,
      id: props.id,
      operation: props.operation.toJSON(),
      arguments: props.arguments,
      value: props.value,
    }),
  };
}
