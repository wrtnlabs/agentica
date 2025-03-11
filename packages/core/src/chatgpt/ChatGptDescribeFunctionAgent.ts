import { ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";

import { AgenticaContext } from "../context/AgenticaContext";
import { AgenticaDescribeEvent } from "../events/AgenticaDescribeEvent";
import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { MPSCUtil } from "../internal/MPSCUtil";
import { StreamUtil } from "../internal/StreamUtil";
import { AgenticaDescribePrompt } from "../prompts/AgenticaDescribePrompt";
import { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptDescribeFunctionAgent {
  export const execute = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
    histories: AgenticaExecutePrompt<Model>[],
  ): Promise<AgenticaDescribePrompt<Model>[]> => {
    if (histories.length === 0) return [];
    const completionStream = await ctx.request("describe", {
      messages: [
        // COMMON SYSTEM PROMPT
        {
          role: "system",
          content: AgenticaDefaultPrompt.write(ctx.config),
        } satisfies OpenAI.ChatCompletionSystemMessageParam,
        // FUNCTION CALLING HISTORIES
        ...histories.map(ChatGptHistoryDecoder.decode).flat(),
        // SYSTEM PROMPT
        {
          role: "system",
          content:
            ctx.config?.systemPrompt?.describe?.(histories) ??
            AgenticaSystemPrompt.DESCRIBE,
        },
      ],
    });

    const describeContext: ({
      content: string;
    } & ReturnType<typeof MPSCUtil.create<string>>)[] = [];

    const completion = await StreamUtil.reduce<
      OpenAI.ChatCompletionChunk,
      Promise<OpenAI.ChatCompletion>
    >(completionStream, async (accPromise, chunk) => {
      const acc = await accPromise;
      const registerContext = (
        choices: OpenAI.ChatCompletionChunk.Choice[],
      ) => {
        for (const choice of choices) {
          if (choice.finish_reason) {
            describeContext[choice.index]!.close();
            continue;
          }
          if (!choice.delta.content) {
            continue;
          }

          if (describeContext[choice.index]) {
            describeContext[choice.index]!.content += choice.delta.content;
            describeContext[choice.index]!.produce(choice.delta.content);
            continue;
          }

          const { consumer, produce, close, waitClose, done } =
            MPSCUtil.create<string>();

          describeContext[choice.index] = {
            content: choice.delta.content,
            consumer,
            produce,
            close,
            waitClose,
            done,
          };
          produce(choice.delta.content);

          void ctx.dispatch(
            new AgenticaDescribeEvent({
              executes: histories,
              stream: consumer,
              done,
              get: () => describeContext[choice.index]?.content ?? "",
              join: async () => {
                await waitClose();
                return describeContext[choice.index]!.content;
              },
            }),
          );
        }
      };

      if (acc.object === "chat.completion.chunk") {
        registerContext([acc, chunk].flatMap((acc) => acc.choices));
        return ChatGptCompletionMessageUtil.merge([acc, chunk]);
      }

      registerContext(chunk.choices);
      return ChatGptCompletionMessageUtil.accumulate(acc, chunk);
    });

    if (!completion) throw new Error("No completion received");
    const descriptions: AgenticaDescribePrompt<Model>[] = completion.choices
      .map((choice) =>
        choice.message.role === "assistant" && !!choice.message.content?.length
          ? choice.message.content
          : null,
      )
      .filter((str) => str !== null)
      .map(
        (content) =>
          new AgenticaDescribePrompt({
            executes: histories,
            text: content,
          }),
      );
    return descriptions;
  };
}
