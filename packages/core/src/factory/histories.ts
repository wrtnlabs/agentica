import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaCancelHistory } from "../histories/AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { AgenticaTextHistory } from "../histories/AgenticaTextHistory";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

export function decodeHistory<Model extends ILlmSchema.Model>(history: AgenticaHistory<Model>): OpenAI.ChatCompletionMessageParam[] {
  // NO NEED TO DECODE DESCRIBE
  if (history.type === "describe") {
    return [];
  }
  else if (history.type === "text") {
    return [
      {
        role: history.role,
        content: history.text,
      },
    ];
  }
  else if (history.type === "select" || history.type === "cancel") {
    return [
      {
        role: "assistant",
        tool_calls: [
          {
            type: "function",
            id: history.id,
            function: {
              name: `${history.type}Functions`,
              arguments: JSON.stringify({
                functions: history.selections.map(s => ({
                  name: s.operation.function.name,
                  reason: s.reason,
                })),
              }),
            },
          },
        ],
      },
      {
        role: "tool",
        tool_call_id: history.id,
        content: "",
      },
    ];
  }

  return [
    {
      role: "assistant",
      tool_calls: [
        {
          type: "function",
          id: history.id,
          function: {
            name: history.operation.name,
            arguments: JSON.stringify(history.arguments),
          },
        },
      ],
    },
    {
      role: "tool",
      tool_call_id: history.id,
      content: JSON.stringify({
        function: {
          protocol: history.operation.protocol,
          description: history.operation.function.description,
          parameters: history.operation.function.parameters,
          output: history.operation.function.output,
          ...(history.operation.protocol === "http"
            ? {
                method: history.operation.function.method,
                path: history.operation.function.path,
              }
            : {}),
        },
        ...(history.operation.protocol === "http"
          ? {
              status: (history.value as IHttpResponse).status,
              data: (history.value as IHttpResponse).body,
            }
          : {
              value: history.value,
            }),
      }),
    },
  ];
}

/* -----------------------------------------------------------
  TEXT PROMPTS
----------------------------------------------------------- */
export function createTextHistory<Role extends "assistant" | "user" = "assistant" | "user">(props: {
  role: Role;
  text: string;
}): AgenticaTextHistory<Role> {
  const prompt: IAgenticaHistoryJson.IText<Role> = {
    type: "text",
    role: props.role,
    text: props.text,
  };
  return {
    ...prompt,
    toJSON: () => prompt,
  };
}

export function createDescribeHistory<Model extends ILlmSchema.Model>(props: {
  executes: AgenticaExecuteHistory<Model>[];
  text: string;
}): AgenticaDescribeHistory<Model> {
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
export function createSelectHistory<Model extends ILlmSchema.Model>(props: {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}): AgenticaSelectHistory<Model> {
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

export function createCancelHistory<Model extends ILlmSchema.Model>(props: {
  id: string;
  selections: AgenticaOperationSelection<Model>[];
}): AgenticaCancelHistory<Model> {
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

export function createExecuteHistory<
  Model extends ILlmSchema.Model,
>(props: {
  id: string;
  operation: AgenticaOperation<Model>;
  arguments: Record<string, any>;
  value: unknown;
}): AgenticaExecuteHistory<Model> {
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
