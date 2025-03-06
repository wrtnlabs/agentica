import { ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";

import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { MPSCUtil } from "../internal/MPSCUtil";
import { StreamUtil } from "../internal/StreamUtil";
import { IAgenticaContext } from "../structures/IAgenticaContext";
import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptDescribeFunctionAgent {
  export const execute = async <Model extends ILlmSchema.Model>(
    ctx: IAgenticaContext<Model>,
    histories: IAgenticaPrompt.IExecute<Model>[],
  ): Promise<IAgenticaPrompt.IDescribe<Model>[]> => {
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

      const registerContext = async (
        choices: OpenAI.ChatCompletionChunk.Choice[],
      ) => {
        for (const choice of choices) {
          if (choice.delta.content) {
            if (describeContext[choice.index]) {
              describeContext[choice.index]!.content += choice.delta.content;
            } else {
              const { consumer, produce, close, waitClose } =
                MPSCUtil.create<string>();

              describeContext[choice.index] = {
                content: choice.delta.content,
                consumer,
                produce,
                close,
                waitClose,
              };

              await ctx.dispatch({
                type: "describe",
                executions: histories,
                stream: consumer,
                join: async () => {
                  await waitClose();
                  return describeContext[choice.index]!.content;
                },
              });
            }
          }
        }
      };

      if (acc.object === "chat.completion.chunk") {
        await registerContext([acc, chunk].flatMap((acc) => acc.choices));
        return ChatGptCompletionMessageUtil.merge([acc, chunk]);
      }

      await registerContext(chunk.choices);
      return ChatGptCompletionMessageUtil.accumulate(acc, chunk);
    });

    if (!completion) throw new Error("No completion received");
    const descriptions: IAgenticaPrompt.IDescribe<Model>[] = completion.choices
      .map((choice) =>
        choice.message.role === "assistant" && !!choice.message.content?.length
          ? choice.message.content
          : null,
      )
      .filter((str) => str !== null)
      .map(
        (content) =>
          ({
            type: "describe",
            executions: histories,
            text: content,
          }) satisfies IAgenticaPrompt.IDescribe<Model>,
      );
    return descriptions;
  };
}
