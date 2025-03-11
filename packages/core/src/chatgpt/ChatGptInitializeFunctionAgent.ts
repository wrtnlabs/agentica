import { ILlmFunction, ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";
import typia from "typia";

import { AgenticaContext } from "../context/AgenticaContext";
import { __IChatInitialApplication } from "../context/internal/__IChatInitialApplication";
import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { StreamUtil } from "../internal/StreamUtil";
import { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptInitializeFunctionAgent {
  export const execute = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
  ): Promise<AgenticaPrompt<Model>[]> => {
    //----
    // EXECUTE CHATGPT API
    //----
    const completionStream = await ctx.request("initialize", {
      messages: [
        // COMMON SYSTEM PROMPT
        {
          role: "system",
          content: AgenticaDefaultPrompt.write(ctx.config),
        } satisfies OpenAI.ChatCompletionSystemMessageParam,
        // PREVIOUS HISTORIES
        ...ctx.histories.map(ChatGptHistoryDecoder.decode).flat(),
        // USER INPUT
        {
          role: "user",
          content: ctx.prompt.text,
        },
        {
          // SYSTEM PROMPT
          role: "system",
          content:
            ctx.config?.systemPrompt?.initialize?.(ctx.histories) ??
            AgenticaSystemPrompt.INITIALIZE,
        },
      ],
      // GETTER FUNCTION
      tools: [
        {
          type: "function",
          function: {
            name: FUNCTION.name,
            description: FUNCTION.description,
            parameters: FUNCTION.parameters as any,
          },
        },
      ],
      tool_choice: "auto",
      parallel_tool_calls: false,
    });

    const chunks = await StreamUtil.readAll(completionStream);
    const completion = ChatGptCompletionMessageUtil.merge(chunks);
    //----
    // PROCESS COMPLETION
    //----
    const prompts: AgenticaPrompt<Model>[] = [];
    for (const choice of completion.choices) {
      if (
        choice.message.role === "assistant" &&
        !!choice.message.content?.length
      ) {
        // @TODO this logic should call the dispatch function
        prompts.push(
          new AgenticaTextPrompt({
            role: "assistant",
            text: choice.message.content,
          }),
        );
      }
    }
    if (
      completion.choices.some(
        (c) =>
          !!c.message.tool_calls?.some(
            (tc) =>
              tc.type === "function" && tc.function.name === FUNCTION.name,
          ),
      )
    )
      await ctx.initialize();
    return prompts;
  };
}

const FUNCTION: ILlmFunction<"chatgpt"> = typia.llm.application<
  __IChatInitialApplication,
  "chatgpt"
>().functions[0]!;
