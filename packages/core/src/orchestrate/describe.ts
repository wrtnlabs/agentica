import type OpenAI from "openai";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { MicroAgenticaContext } from "../context/MicroAgenticaContext";
import type { AgenticaDescribeEvent } from "../events";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";

import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { createDescribeEvent } from "../factory/events";
import { decodeHistory } from "../factory/histories";
import { reduceStreamingWithDispatch } from "../utils/ChatGptCompletionStreamingUtil";

export async function describe(
  ctx: AgenticaContext | MicroAgenticaContext,
  histories: AgenticaExecuteHistory[],
): Promise<void> {
  if (histories.length === 0) {
    return;
  }

  const completionStream = await ctx.request("describe", {
    messages: [
      // COMMON SYSTEM PROMPT
      {
        role: "system",
        content: AgenticaDefaultPrompt.write(ctx.config),
      } satisfies OpenAI.ChatCompletionSystemMessageParam,
      // FUNCTION CALLING HISTORIES
      ...histories.map(decodeHistory).flat(),
      // SYSTEM PROMPT
      {
        role: "system",
        content:
          ctx.config?.systemPrompt?.describe?.(histories)
          ?? AgenticaSystemPrompt.DESCRIBE,
      },
    ],
  });

  await reduceStreamingWithDispatch(completionStream, (props) => {
    const event: AgenticaDescribeEvent = createDescribeEvent({
      executes: histories,
      ...props,
    });
    void ctx.dispatch(event).catch(() => {});
  }, ctx.abortSignal);
}

export const ChatGptDescribeFunctionAgent = {
  execute: describe,
};
