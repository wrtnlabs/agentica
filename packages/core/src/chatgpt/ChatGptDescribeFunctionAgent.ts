import { ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";

import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { IAgenticaContext } from "../structures/IAgenticaContext";
import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptDescribeFunctionAgent {
  export const execute = async <Model extends ILlmSchema.Model>(
    ctx: IAgenticaContext<Model>,
    histories: IAgenticaPrompt.IExecute<Model>[],
  ): Promise<IAgenticaPrompt.IDescribe<Model>[]> => {
    if (histories.length === 0) return [];
    const completion: OpenAI.ChatCompletion = await ctx.request("describe", {
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
    for (const describe of descriptions) await ctx.dispatch(describe);
    return descriptions;
  };
}
