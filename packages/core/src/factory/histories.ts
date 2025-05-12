import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaUserMessageContent } from "../histories";
import type { AgenticaAssistantMessageHistory } from "../histories/AgenticaAssistantMessageHistory";
import type { AgenticaCancelHistory } from "../histories/AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { AgenticaUserMessageHistory } from "../histories/AgenticaUserMessageHistory";
import type { IAgenticaHistoryJson } from "../json/IAgenticaHistoryJson";

/**
 * @internal
 */
export function decodeHistory<Model extends ILlmSchema.Model>(history: AgenticaHistory<Model>): OpenAI.ChatCompletionMessageParam[] {
  // NO NEED TO DECODE DESCRIBE
  if (history.type === "describe") {
    return [];
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
  else if (history.type === "execute") {
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
  else if (history.type === "assistantMessage") {
    return [
      {
        role: "assistant",
        content: history.text,
      },
    ];
  }
  return [
    {
      role: "user",
      content: history.contents.map(decodeUserMessageContent),
    },
  ];
}

/**
 * @internal
 */
export function decodeUserMessageContent(content: AgenticaUserMessageContent): OpenAI.ChatCompletionContentPart {
  if (content.type === "audio") {
    return {
      type: "input_audio",
      input_audio: {
        data: content.data,
        format: content.format,
      },
    };
  }
  else if (content.type === "file") {
    return {
      type: "file",
      file: content.file.type === "data"
        ? {
            file_data: content.file.data,
            filename: content.file.name,
          }
        : {
            file_id: content.file.id,
          },
    };
  }
  else if (content.type === "image") {
    return {
      type: "image_url",
      image_url: {
        url: content.url,
        detail: content.detail,
      },
    };
  }
  return content;
}

/* -----------------------------------------------------------
  USER INPUT PROMPTS
----------------------------------------------------------- */
/**
 * @internal
 */
export function createUserMessageHistory(props: {
  contents: Array<AgenticaUserMessageContent>;
}): AgenticaUserMessageHistory {
  return {
    type: "userMessage",
    contents: props.contents,
    toJSON: () => ({
      type: "userMessage",
      contents: props.contents,
    }),
  };
}

/* -----------------------------------------------------------
  TEXT PROMPTS
----------------------------------------------------------- */
/**
 * @internal
 */
export function createAssistantMessageHistory(props: {
  text: string;
}): AgenticaAssistantMessageHistory {
  const prompt: IAgenticaHistoryJson.IAssistantMessage = {
    type: "assistantMessage",
    text: props.text,
  };
  return {
    ...prompt,
    toJSON: () => prompt,
  };
}

/**
 * @internal
 */
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
/**
 * @internal
 */
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

/**
 * @internal
 */
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

/**
 * @internal
 */
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
