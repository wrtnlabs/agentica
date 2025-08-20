import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";
import type { tags } from "typia";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { AgenticaUserMessageContent } from "../histories";
import type { AgenticaAssistantMessageHistory } from "../histories/AgenticaAssistantMessageHistory";
import type { AgenticaCancelHistory } from "../histories/AgenticaCancelHistory";
import type { AgenticaDescribeHistory } from "../histories/AgenticaDescribeHistory";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { AgenticaSystemMessageHistory } from "../histories/AgenticaSystemMessageHistory";
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
                function: {
                  name: history.selection.operation.name,
                  reason: history.selection.reason,
                },
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

  if (history.type === "assistantMessage") {
    return [
      {
        role: "assistant",
        content: history.text,
      },
    ];
  }

  if (history.type === "systemMessage") {
    return [
      {
        role: "system",
        content: history.text,
      },
    ];
  }

  if (history.type === "userMessage") {
    const contents = history.contents;
    return [
      {
        role: "user",
        content: contents.map(decodeUserMessageContent),
      },
    ];
  }

  history satisfies never;
  throw new Error(`Unsupported history type, value: ${JSON.stringify(history)}`);
}

/**
 * @internal
 */
export function decodeUserMessageContent(content: AgenticaUserMessageContent): OpenAI.ChatCompletionContentPart {
  if (content.type === "text") {
    return content;
  }

  if (content.type === "audio") {
    return {
      type: "input_audio",
      input_audio: {
        data: content.data,
        format: content.format,
      },
    };
  }

  if (content.type === "file") {
    return {
      type: "file",
      file: content.file.type === "base64"
        ? {
            file_data: content.file.data,
            filename: content.file.name,
          }
        : {
            file_id: content.file.id,
          },
    };
  }

  if (content.type === "image") {
    return {
      type: "image_url",
      image_url: {
        url: content.image.type === "base64"
          ? content.image.data
          : content.image.url,
        detail: content.detail,
      },
    };
  }

  content satisfies never;
  throw new Error(`Unsupported user message content type, value: ${JSON.stringify(content)}`);
}

/* -----------------------------------------------------------
  USER INPUT PROMPTS
----------------------------------------------------------- */
/**
 * @internal
 */
export function createUserMessageHistory(props: {
  id: string;
  created_at: string & tags.Format<"date-time">;
  contents: Array<AgenticaUserMessageContent>;
}): AgenticaUserMessageHistory {
  return {
    type: "userMessage",
    id: props.id,
    created_at: props.created_at,
    contents: props.contents,
    toJSON: () => ({
      type: "userMessage",
      id: props.id,
      created_at: props.created_at,
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
  id: string;
  created_at: string & tags.Format<"date-time">;
  text: string;
}): AgenticaAssistantMessageHistory {
  const prompt: IAgenticaHistoryJson.IAssistantMessage = {
    type: "assistantMessage",
    id: props.id,
    created_at: props.created_at,
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
export function createSystemMessageHistory(props: {
  id: string;
  created_at: string & tags.Format<"date-time">;
  text: string;
}): AgenticaSystemMessageHistory {
  const prompt: IAgenticaHistoryJson.ISystemMessage = {
    type: "systemMessage",
    id: props.id,
    created_at: props.created_at,
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
  id: string;
  created_at: string & tags.Format<"date-time">;
  executes: AgenticaExecuteHistory<Model>[];
  text: string;
}): AgenticaDescribeHistory<Model> {
  return {
    type: "describe",
    id: props.id,
    created_at: props.created_at,
    text: props.text,
    executes: props.executes,
    toJSON: () => ({
      type: "describe",
      id: props.id,
      created_at: props.created_at,
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
  created_at: string & tags.Format<"date-time">;
  selection: AgenticaOperationSelection<Model>;
}): AgenticaSelectHistory<Model> {
  return {
    type: "select",
    id: props.id,
    selection: props.selection,
    created_at: props.created_at,
    toJSON: () => ({
      type: "select",
      id: props.id,
      created_at: props.created_at,
      selection: props.selection.toJSON(),
    }),
  };
}

/**
 * @internal
 */
export function createCancelHistory<Model extends ILlmSchema.Model>(props: {
  id: string;
  created_at: string & tags.Format<"date-time">;
  selection: AgenticaOperationSelection<Model>;
}): AgenticaCancelHistory<Model> {
  return {
    type: "cancel",
    id: props.id,
    created_at: props.created_at,
    selection: props.selection,
    toJSON: () => ({
      type: "cancel",
      id: props.id,
      created_at: props.created_at,
      selection: props.selection.toJSON(),
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
  created_at: string & tags.Format<"date-time">;
  operation: AgenticaOperation<Model>;
  arguments: Record<string, any>;
  value: unknown;
  success: boolean;
}): AgenticaExecuteHistory<Model> {
  return {
    type: "execute",
    protocol: props.operation.protocol as "class",
    id: props.id,
    created_at: props.created_at,
    operation: props.operation as AgenticaOperation.Class<Model>,
    arguments: props.arguments,
    value: props.value,
    success: props.success,
    toJSON: () => ({
      type: "execute",
      id: props.id,
      created_at: props.created_at,
      protocol: props.operation.protocol,
      operation: props.operation.toJSON(),
      arguments: props.arguments,
      value: props.value,
      success: props.success,
    }),
  };
}
