import type { ILlmFunction, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import typia from "typia";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { __IChatInitialApplication } from "../context/internal/__IChatInitialApplication";
import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";

import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { createTextEvent } from "../factory/events";
import { createTextPrompt, decodePrompt } from "../factory/prompts";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { MPSC } from "../utils/MPSC";
import { StreamUtil } from "../utils/StreamUtil";

const FUNCTION: ILlmFunction<"chatgpt"> = typia.llm.application<
  __IChatInitialApplication,
  "chatgpt"
>().functions[0]!;

export async function initialize<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<AgenticaPrompt<Model>[]> {
  // ----
  // EXECUTE CHATGPT API
  // ----
  const completionStream = await ctx.request("initialize", {
    messages: [
        // COMMON SYSTEM PROMPT
        {
          role: "system",
          content: AgenticaDefaultPrompt.write(ctx.config),
        } satisfies OpenAI.ChatCompletionSystemMessageParam,
        // PREVIOUS HISTORIES
        ...ctx.histories.map(decodePrompt).flat(),
        // USER INPUT
        {
          role: "user",
          content: ctx.prompt.text,
        },
        {
          // SYSTEM PROMPT
          role: "system",
          content:
            ctx.config?.systemPrompt?.initialize?.(ctx.histories)
            ?? AgenticaSystemPrompt.INITIALIZE,
        },
    ],
    // GETTER FUNCTION
    tools: [
      {
        type: "function",
        function: {
          name: FUNCTION.name,
          description: FUNCTION.description,
          /**
           * @TODO fix it
           * The property and value have a type mismatch, but it works.
           */
          parameters: FUNCTION.parameters as unknown as Record<string, unknown>,
        },
      },
    ],
    tool_choice: "auto",
    parallel_tool_calls: false,
  });

  const textContext: ({
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
          textContext[choice.index]?.mpsc.close();
          continue;
        }

        if (choice.delta.content == null) {
          continue;
        }

        if (textContext[choice.index] != null) {
          textContext[choice.index]!.content += choice.delta.content;
          textContext[choice.index]!.mpsc.produce(choice.delta.content);
          continue;
        }

        const mpsc = new MPSC<string>();

        textContext[choice.index] = {
          content: choice.delta.content,
          mpsc,
        };
        mpsc.produce(choice.delta.content);

        void ctx.dispatch(
          createTextEvent({
            role: "assistant",
            stream: mpsc.consumer,
            done: () => mpsc.done(),
            get: () => textContext[choice.index]!.content,
            join: async () => {
              await mpsc.waitClosed();
              return textContext[choice.index]!.content;
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

  if (completion === null) {
    throw new Error("No completion received");
  }

  // ----
  // PROCESS COMPLETION
  // ----
  const prompts: AgenticaPrompt<Model>[] = [];
  for (const choice of completion.choices) {
    if (
      choice.message.role === "assistant"
      && choice.message.content != null
    ) {
      prompts.push(
        createTextPrompt({
          role: "assistant",
          text: choice.message.content,
        }),
      );
    }
  }
  if (
    completion.choices.some(
      c =>
        c.message.tool_calls != null
        && c.message.tool_calls.some(
          tc =>
            tc.type === "function" && tc.function.name === FUNCTION.name,
        ),
    )
  ) { await ctx.initialize(); }

  return prompts;
}
