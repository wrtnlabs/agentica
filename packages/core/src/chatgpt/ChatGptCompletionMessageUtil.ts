import {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionMessage,
  ChatCompletionMessageToolCall,
} from "openai/resources";

import { ChatGptUsageAggregator } from "./ChatGptUsageAggregator";

export namespace ChatGptCompletionMessageUtil {
  export const accumulate = (
    origin: ChatCompletion,
    chunk: ChatCompletionChunk,
  ): ChatCompletion => {
    const choices = origin.choices;
    chunk.choices.forEach((choice) => {
      const accChoice = choices[choice.index];
      if (accChoice) {
        choices[choice.index] = mergeChoice(accChoice, choice);
        return;
      }

      choices[choice.index] = {
        index: choice.index,

        finish_reason:
          choice.finish_reason ??
          (null as unknown as ChatCompletion.Choice["finish_reason"]),

        logprobs: choice.logprobs ?? null,
        message: {
          content: choice.delta.content ?? null,
          refusal: choice.delta.refusal ?? null,
          role: "assistant",
          tool_calls: undefined,
        } satisfies ChatCompletionMessage,
      };
    });

    const usage = (() => {
      if (!chunk.usage) {
        return origin.usage;
      }

      if (!origin.usage) {
        return chunk.usage;
      }

      return ChatGptUsageAggregator.sum(origin.usage, chunk.usage);
    })();

    return {
      ...origin,
      choices,
      usage,
    };
  };

  export const merge = (chunks: ChatCompletionChunk[]): ChatCompletion => {
    const firstChunk = chunks[0];
    if (!firstChunk) throw new Error("No chunks received");

    return chunks.reduce(ChatGptCompletionMessageUtil.accumulate, {
      id: firstChunk.id,
      choices: [],
      created: firstChunk.created,
      model: firstChunk.model,
      object: "chat.completion",
      usage: undefined,
      service_tier: firstChunk.service_tier,
      system_fingerprint: firstChunk.system_fingerprint,
    } as ChatCompletion);
  };

  export const mergeChoice = (
    acc: ChatCompletion.Choice,
    cur: ChatCompletionChunk.Choice,
  ): ChatCompletion.Choice => {
    if (!acc.finish_reason && cur.finish_reason) {
      acc.finish_reason = cur.finish_reason;
    }

    if (!acc.logprobs && cur.logprobs) {
      acc.logprobs = cur.logprobs;
    }

    if (cur.delta.content) {
      if (!acc.message.content) {
        acc.message.content = cur.delta.content;
      } else {
        acc.message.content += cur.delta.content;
      }
    }

    if (cur.delta.refusal) {
      if (!acc.message.refusal) {
        acc.message.refusal = cur.delta.refusal;
      } else {
        acc.message.refusal += cur.delta.refusal;
      }
    }

    if (cur.delta.tool_calls) {
      const toolCalls = acc.message.tool_calls ?? [];

      cur.delta.tool_calls.forEach((toolCall) => {
        const existingToolCall = toolCalls[toolCall.index];
        if (existingToolCall) {
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
  };

  export const mergeToolCalls = (
    acc: ChatCompletionMessageToolCall,
    cur: ChatCompletionChunk.Choice.Delta.ToolCall,
  ): ChatCompletionMessageToolCall => {
    if (cur.function) {
      acc.function.arguments += cur.function.arguments ?? "";
      acc.function.name += cur.function.name ?? "";
    }

    acc.id += cur.id ?? "";

    return acc;
  };
}
