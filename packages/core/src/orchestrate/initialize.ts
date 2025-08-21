import type { ILlmFunction, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import typia from "typia";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { __IChatInitialApplication } from "../context/internal/__IChatInitialApplication";
import type { AgenticaAssistantMessageEvent } from "../events/AgenticaAssistantMessageEvent";

import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { createAssistantMessageEvent } from "../factory/events";
import { decodeHistory, decodeUserMessageContent } from "../factory/histories";
import { reduceStreamingWithDispatch } from "../utils/ChatGptCompletionStreamingUtil";

const FUNCTION: ILlmFunction<"chatgpt"> = typia.llm.application<
  __IChatInitialApplication,
  "chatgpt"
>().functions[0]!;

export async function initialize<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<void> {
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
      ...ctx.histories.map(decodeHistory).flat(),
      // USER INPUT
      {
        role: "user",
        content: ctx.prompt.contents.map(decodeUserMessageContent),
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
    // parallel_tool_calls: false,
  });

  const completion = await reduceStreamingWithDispatch(completionStream, (props) => {
    const event: AgenticaAssistantMessageEvent = createAssistantMessageEvent(props);
    ctx.dispatch(event);
  });

  if (completion === null) {
    throw new Error("No completion received");
  }

  // ----
  // PROCESS COMPLETION
  // ----
  if (
    completion.choices.some(
      c =>
        c.message.tool_calls != null
        && c.message.tool_calls.some(
          tc =>
            tc.type === "function" && tc.function.name === FUNCTION.name,
        ),
    )
  ) {
    await ctx.initialize();
  }
}
