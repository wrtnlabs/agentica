import { ILlmFunction, ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";
import typia from "typia";

import { AgenticaContext } from "../context/AgenticaContext";
import { __IChatInitialApplication } from "../context/internal/__IChatInitialApplication";
import { AgenticaTextEvent } from "../events/AgenticaTextEvent";
import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { MPSCUtil } from "../internal/MPSCUtil";
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

    const textContext: ({
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
            textContext[choice.index]?.close();
            continue;
          }
          if (!choice.delta.content) {
            continue;
          }

          if (textContext[choice.index]) {
            textContext[choice.index]!.content += choice.delta.content;
            textContext[choice.index]!.produce(choice.delta.content);
            continue;
          }

          const { consumer, produce, close, waitClosed, waitUntilEmpty, done } =
            MPSCUtil.create<string>();

          textContext[choice.index] = {
            content: choice.delta.content,
            consumer,
            produce,
            close,
            waitClosed,
            waitUntilEmpty,
            done,
          };
          produce(choice.delta.content);

          void ctx.dispatch(
            new AgenticaTextEvent({
              role: "assistant",
              stream: consumer,
              done,
              get: () => textContext[choice.index]?.content ?? "",
              join: async () => {
                await waitClosed();
                return textContext[choice.index]!.content;
              },
            }),
          );
        }
      };

      if (acc.object === "chat.completion.chunk") {
        registerContext([acc, chunk].flatMap((v) => v.choices));
        return ChatGptCompletionMessageUtil.merge([acc, chunk]);
      }

      registerContext(chunk.choices);
      return ChatGptCompletionMessageUtil.accumulate(acc, chunk);
    });

    if (!completion) {
      throw new Error("No completion received");
    }

    //----
    // PROCESS COMPLETION
    //----
    const prompts: AgenticaPrompt<Model>[] = [];
    for (const choice of completion.choices) {
      if (
        choice.message.role === "assistant" &&
        !!choice.message.content?.length
      ) {
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
