import OpenAI from "openai";

import { WrtnAgentDefaultPrompt } from "../internal/WrtnAgentDefaultPrompt";
import { WrtnAgentSystemPrompt } from "../internal/WrtnAgentSystemPrompt";
import { IWrtnAgentContext } from "../structures/IWrtnAgentContext";
import { IWrtnAgentPrompt } from "../structures/IWrtnAgentPrompt";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptDescribeFunctionAgent {
  export const execute = async (
    ctx: IWrtnAgentContext,
    histories: IWrtnAgentPrompt.IExecute[],
  ): Promise<IWrtnAgentPrompt.IDescribe[]> => {
    if (histories.length === 0) return [];
    const completion: OpenAI.ChatCompletion = await ctx.request("describe", {
      messages: [
        // COMMON SYSTEM PROMPT
        {
          role: "system",
          content: WrtnAgentDefaultPrompt.write(ctx.config),
        } satisfies OpenAI.ChatCompletionSystemMessageParam,
        // FUNCTION CALLING HISTORIES
        ...histories.map(ChatGptHistoryDecoder.decode).flat(),
        // SYSTEM PROMPT
        {
          role: "system",
          content:
            ctx.config?.systemPrompt?.describe?.(histories) ??
            WrtnAgentSystemPrompt.DESCRIBE,
        },
      ],
    });
    const descriptions: IWrtnAgentPrompt.IDescribe[] = completion.choices
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
          }) satisfies IWrtnAgentPrompt.IDescribe,
      );
    for (const describe of descriptions) await ctx.dispatch(describe);
    return descriptions;
  };
}
