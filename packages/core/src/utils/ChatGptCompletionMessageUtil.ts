import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageToolCall,
  CompletionUsage,
} from "openai/resources";

import typia from "typia";

import { ByteArrayUtil } from "./ByteArrayUtil";
import { ChatGptTokenUsageAggregator } from "./ChatGptTokenUsageAggregator";

function transformCompletionChunk(source: string | Uint8Array): ChatCompletionChunk {
  const str
      = source instanceof Uint8Array ? ByteArrayUtil.toUtf8(source) : source;
  const result: ChatCompletionChunk = JSON.parse(str) as ChatCompletionChunk;
  const valid = typia.validate<ChatCompletionChunk>(result);
  if (valid.success === false) {
    console.error("Invalid ChatCompletionChunk", valid.errors);
  }
  return result;
}

function accumulate(origin: ChatCompletion, chunk: ChatCompletionChunk): ChatCompletion {
  const choices = origin.choices;
  chunk.choices.forEach((choice) => {
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
      message: {
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
      } satisfies ChatCompletionMessage,
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

  return chunks.reduce(accumulate, {
    id: firstChunk.id,
    choices: [],
    created: firstChunk.created,
    model: firstChunk.model,
    object: "chat.completion",
    usage: undefined,
    service_tier: firstChunk.service_tier,
    system_fingerprint: firstChunk.system_fingerprint,
  } as ChatCompletion);
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

  if (cur.delta.tool_calls != null) {
    acc.message.tool_calls ??= [];
    const toolCalls = acc.message.tool_calls;

    cur.delta.tool_calls.forEach((toolCall) => {
      const existingToolCall = toolCalls[toolCall.index];
      if (existingToolCall != null) {
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

function mergeToolCalls(acc: ChatCompletionMessageToolCall, cur: ChatCompletionChunk.Choice.Delta.ToolCall): ChatCompletionMessageToolCall {
  if (cur.function != null) {
    acc.function.arguments += cur.function.arguments ?? "";
    acc.function.name += cur.function.name ?? "";
  }

  acc.id += cur.id ?? "";

  return acc;
}

export const ChatGptCompletionMessageUtil = {
  transformCompletionChunk,
  accumulate,
  merge,
  mergeChoice,
  mergeToolCalls,
};
