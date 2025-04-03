import type { ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";
import type { MicroAgenticaContext } from "../context/MicroAgenticaContext";
import type { AgenticaContext } from "../context/AgenticaContext";

import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { MPSC } from "../utils/MPSC";
import { StreamUtil } from "../utils/StreamUtil";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { createDescribeEvent } from "../factory/events";
import { createDescribePrompt, decodePrompt } from "../factory/prompts";

export async function describe<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
  histories: AgenticaExecutePrompt<Model>[],
): Promise<AgenticaDescribePrompt<Model>[]> {
  if (histories.length === 0) {
    return [];
  }

  const completionStream = await ctx.request("describe", {
    messages: [
      // COMMON SYSTEM PROMPT
      {
        role: "system",
        content: AgenticaDefaultPrompt.write(ctx.config),
      } satisfies OpenAI.ChatCompletionSystemMessageParam,
      // FUNCTION CALLING HISTORIES
      ...histories.map(decodePrompt).flat(),
      // SYSTEM PROMPT
      {
        role: "system",
        content:
          ctx.config?.systemPrompt?.describe?.(histories)
          ?? AgenticaSystemPrompt.DESCRIBE,
      },
    ],
  });

  const describeContext: ({
    content: string;
    mpsc: MPSC<string>;
  })[] = [];

  const completion = await StreamUtil.reduce<
    OpenAI.ChatCompletionChunk,
    Promise<OpenAI.ChatCompletion>
  >(completionStream, async (accPromise, chunk) => {
    const acc = await accPromise;
    const registerContext = (
      choices: OpenAI.ChatCompletionChunk.Choice[],
    ) => {
      for (const choice of choices) {
        /**
         * @TODO fix it
         * Sometimes, the complete message arrives along with a finish reason.
         */
        if (choice.finish_reason != null) {
          describeContext[choice.index]!.mpsc.close();
          continue;
        }

        if (choice.delta.content == null) {
          continue;
        }

        if (describeContext[choice.index] != null) {
          describeContext[choice.index]!.content += choice.delta.content;
          describeContext[choice.index]!.mpsc.produce(choice.delta.content);
          continue;
        }

        const mpsc = new MPSC<string>();

        describeContext[choice.index] = {
          content: choice.delta.content,
          mpsc,
        };
        mpsc.produce(choice.delta.content);

        void ctx.dispatch(
          createDescribeEvent({
            executes: histories,
            stream: mpsc.consumer,
            done: () => mpsc.done(),
            get: () => describeContext[choice.index]?.content ?? "",
            join: async () => {
              await mpsc.waitClosed();
              return describeContext[choice.index]!.content;
            },
          }),
        );
      }
    };

    if (acc.object === "chat.completion.chunk") {
      registerContext([acc, chunk].flatMap(v => v.choices));
      return ChatGptCompletionMessageUtil.merge([acc, chunk]);
    }

    registerContext(chunk.choices);
    return ChatGptCompletionMessageUtil.accumulate(acc, chunk);
  });

  if (completion == null) {
    throw new Error("No completion received");
  }
  const descriptions: AgenticaDescribePrompt<Model>[] = completion.choices
    .map(choice =>
      choice.message.role === "assistant"
        ? choice.message.content
        : null,
    )
    .filter(str => str !== null)
    .map(
      content =>
        createDescribePrompt({
          executes: histories,
          text: content,
        }),
    );
  return descriptions;
}

export const ChatGptDescribeFunctionAgent = {
  execute: describe,
};
