import type { IJsonParseResult } from "@typia/interface";
import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageFunctionToolCall,
  ChatCompletionMessageToolCall,
} from "openai/resources";

import { dedent, LlmJson } from "@typia/utils";

// import typia from "typia";
import { ByteArrayUtil } from "./ByteArrayUtil";
import { ChatGptAssistantMessageUtil } from "./ChatGptAssistantMessageUtil";
import { ChatGptTokenUsageAggregator } from "./ChatGptTokenUsageAggregator";

function transformCompletionChunk(source: string | Uint8Array): ChatCompletionChunk {
  const str: string = source instanceof Uint8Array
    ? ByteArrayUtil.toUtf8(source)
    : source;
  const result: IJsonParseResult<ChatCompletionChunk> = LlmJson.parse(str);
  if (result.success === false) {
    throw new Error(
      dedent`
        Failed to parse ChatCompletionChunk:

        \`\`\`json
        ${JSON.stringify(result, null, 2)}
        \`\`\`
      `,
    );
  }

  // const valid = typia.validate<ChatCompletionChunk>(result.data);
  // if (valid.success === false) {
  //   console.error("Invalid ChatCompletionChunk", valid.errors);
  // }
  return result.data;
}

function accumulate(origin: ChatCompletion, chunk: ChatCompletionChunk): ChatCompletion {
  const choices = origin.choices ?? [];
  (chunk.choices ?? []).forEach((choice) => {
    const accChoice = choices[choice.index];
    if (accChoice != null) {
      choices[choice.index] = mergeChoice(accChoice, choice);
      return;
    }

    choices[choice.index] = {
      index: choice.index,

      finish_reason:
          choice.finish_reason
          ?? (null as unknown as ChatCompletion.Choice["finish_reason"]),

      logprobs: choice.logprobs ?? null,
      message: ChatGptAssistantMessageUtil.assignFrom({
        tool_calls: choice.delta.tool_calls !== undefined
          ? choice.delta.tool_calls.reduce((acc, cur) => {
              acc[cur.index] = {
                id: cur.id ?? "",
                type: "function",
                function: {
                  name: cur.function?.name ?? "",
                  arguments: cur.function?.arguments ?? "",
                },
              };
              return acc;
            }, [] as ChatCompletionMessageToolCall[])
          : undefined,
        content: choice.delta.content ?? null,
        refusal: choice.delta.refusal ?? null,
        role: "assistant",
      } satisfies ChatCompletionMessage, choice.delta),
    };
  });

  const usage = (() => {
    if (chunk.usage == null) {
      return origin.usage;
    }

    if (origin.usage == null) {
      return chunk.usage;
    }

    return ChatGptTokenUsageAggregator.sum(origin.usage, chunk.usage);
  })();

  return {
    ...origin,
    choices,
    usage,
  };
}

function merge(chunks: ChatCompletionChunk[]): ChatCompletion {
  const firstChunk = chunks[0];
  if (firstChunk === undefined) {
    throw new Error("No chunks received");
  }

  const result = chunks.reduce(accumulate, {
    id: firstChunk.id,
    choices: [],
    created: firstChunk.created,
    model: firstChunk.model,
    object: "chat.completion",
    usage: undefined,
    service_tier: firstChunk.service_tier,
    system_fingerprint: firstChunk.system_fingerprint,
  } as ChatCompletion);

  // post-process
  result.choices?.forEach((choice) => {
    choice.message.tool_calls?.filter(tc => tc.type === "function").forEach((toolCall) => {
      if (toolCall.function.arguments === "") {
        toolCall.function.arguments = "{}";
      }
    });
  });

  return result;
}

function mergeChoice(acc: ChatCompletion.Choice, cur: ChatCompletionChunk.Choice): ChatCompletion.Choice {
  if (acc.finish_reason == null && cur.finish_reason != null) {
    acc.finish_reason = cur.finish_reason;
  }

  if (acc.logprobs == null && cur.logprobs != null) {
    acc.logprobs = cur.logprobs;
  }

  if (cur.delta.content != null) {
    if (acc.message.content == null) {
      acc.message.content = cur.delta.content;
    }
    else {
      acc.message.content += cur.delta.content;
    }
  }

  if (cur.delta.refusal != null) {
    if (acc.message.refusal == null) {
      acc.message.refusal = cur.delta.refusal;
    }
    else {
      acc.message.refusal += cur.delta.refusal;
    }
  }

  mergeAssistantMessagePayload(acc.message, cur.delta);

  if (cur.delta.tool_calls != null) {
    acc.message.tool_calls ??= [];
    const toolCalls = acc.message.tool_calls;

    cur.delta.tool_calls.forEach((toolCall) => {
      const existingToolCall = toolCalls[toolCall.index];
      if (existingToolCall != null && existingToolCall.type === "function") {
        toolCalls[toolCall.index] = mergeToolCalls(
          existingToolCall,
          toolCall,
        );
        return;
      }

      toolCalls[toolCall.index] = {
        id: toolCall.id ?? "",
        type: "function",
        function: {
          name: toolCall.function?.name ?? "",
          arguments: toolCall.function?.arguments ?? "",
        },
      };
    });
  }

  return acc;
}

function mergeToolCalls(acc: ChatCompletionMessageFunctionToolCall, cur: ChatCompletionChunk.Choice.Delta.ToolCall): ChatCompletionMessageToolCall {
  if (cur.function != null) {
    acc.function.arguments += cur.function.arguments ?? "";
    acc.function.name += cur.function.name ?? "";
  }
  acc.id += cur.id ?? "";
  return acc;
}

function mergeAssistantMessagePayload(
  message: ChatCompletionMessage,
  delta: ChatCompletionChunk.Choice.Delta,
): void {
  const target = message as unknown as Record<string, unknown>;
  const source = delta as Record<string, unknown>;
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("reasoning") === false || value === undefined) {
      continue;
    }
    if (typeof value === "string") {
      target[key] = typeof target[key] === "string"
        ? `${target[key]}${value}`
        : value;
    }
    else if (Array.isArray(value)) {
      target[key] = [
        ...(Array.isArray(target[key]) ? target[key] : []),
        ...value,
      ];
    }
    else {
      target[key] = value;
    }
  }
}

export const ChatGptCompletionMessageUtil = {
  transformCompletionChunk,
  accumulate,
  merge,
  mergeChoice,
  mergeToolCalls,
};
