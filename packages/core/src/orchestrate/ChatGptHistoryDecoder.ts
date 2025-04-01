import type { IHttpResponse, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";

function decode<Model extends ILlmSchema.Model>(history: AgenticaPrompt<Model>): OpenAI.ChatCompletionMessageParam[] {
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

export const ChatGptHistoryDecoder = {
  decode,
};
