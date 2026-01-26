import type { ILlmApplication } from "@samchon/openapi";
import type OpenAI from "openai";
import type { IValidation } from "typia";

import typia from "typia";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { __IChatCancelFunctionsApplication } from "../context/internal/__IChatCancelFunctionsApplication";
import type { __IChatFunctionReference } from "../context/internal/__IChatFunctionReference";
import type { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import type { AgenticaEvent } from "../events/AgenticaEvent";

import { AgenticaConstant } from "../constants/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { decodeHistory, decodeUserMessageContent } from "../factory/histories";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { JsonUtil } from "../utils/JsonUtil";
import { StreamUtil } from "../utils/StreamUtil";

import { cancelFunctionFromContext } from "./internal/cancelFunctionFromContext";

const CONTAINER: ILlmApplication = typia.llm.application<
  __IChatCancelFunctionsApplication
>();

interface IFailure {
  id: string;
  name: string;
  validation: IValidation.IFailure;
}

export async function cancel(
  ctx: AgenticaContext,
): Promise<void> {
  if (ctx.operations.divided === undefined) {
    return step(ctx, ctx.operations.array, 0);
  }

  const stacks: AgenticaOperationSelection[][]
      = ctx.operations.divided.map(() => []);
  const events: AgenticaEvent[] = [];
  await Promise.all(
    ctx.operations.divided.map(async (operations, i) =>
      step(
        {
          ...ctx,
          stack: stacks[i]!,
          dispatch: async (e) => {
            events.push(e);
          },
        },
        operations,
        0,
      ),
    ),
  );

  // ELITICISM
  if (
    (ctx.config?.eliticism ?? AgenticaConstant.ELITICISM) === true
    && stacks.some(s => s.length !== 0)
  ) {
    return step(
      ctx,
      stacks
        .flat()
        .map(
          s =>
            ctx.operations.group
              .get(s.operation.controller.name)!
              .get(s.operation.function.name)!,
        ),
      0,
    );
  }
  else {
    const cancelled: AgenticaCancelEvent[]
        = events.filter(e => e.type === "cancel");
    (cancelled.length !== 0 ? cancelled : events)
      .forEach((e) => {
        void ctx.dispatch(e).catch(() => {});
      });
  }
}

async function step(
  ctx: AgenticaContext,
  operations: AgenticaOperation[],
  retry: number,
  failures?: IFailure[],
): Promise<void> {
  // ----
  // EXECUTE CHATGPT API
  // ----
  const result = await ctx.request("cancel", {
    messages: [
      // COMMON SYSTEM PROMPT
      {
        role: "system",
        content: AgenticaDefaultPrompt.write(ctx.config),
      } satisfies OpenAI.ChatCompletionSystemMessageParam,
      // CANDIDATE FUNCTIONS
      {
        role: "assistant",
        tool_calls: [
          {
            type: "function",
            id: "getApiFunctions",
            function: {
              name: "getApiFunctions",
              arguments: JSON.stringify({}),
            },
          },
        ],
      },
      {
        role: "tool",
        tool_call_id: "getApiFunctions",
        content: JSON.stringify(
          operations.map(op => ({
            name: op.name,
            description: op.function.description,
            ...(op.protocol === "http"
              ? {
                  method: op.function.method,
                  path: op.function.path,
                  tags: op.function.tags,
                }
              : {}),
          })),
        ),
      },
      // PREVIOUS HISTORIES
      ...ctx.histories.map(decodeHistory).flat(),
      // USER INPUT
      {
        role: "user",
        content: ctx.prompt.contents.map(decodeUserMessageContent),
      },
      // SYSTEM PROMPT
      {
        role: "system",
        content:
          ctx.config?.systemPrompt?.cancel?.(ctx.histories)
          ?? AgenticaSystemPrompt.CANCEL,
      },
      // TYPE CORRECTIONS
      ...emendMessages(failures ?? []),
    ],
    // STACK FUNCTIONS
    tools: [{
      type: "function",
      function: {
        name: CONTAINER.functions[0]!.name,
        description: CONTAINER.functions[0]!.description,
        /**
         * @TODO fix it
         * The property and value have a type mismatch, but it works.
         */
        parameters: (
          CONTAINER.functions[0]!.parameters as unknown as Record<string, unknown>
        ),
      },
    } satisfies OpenAI.ChatCompletionTool],
    tool_choice: retry === 0
      ? "auto"
      : "required",
    // parallel_tool_calls: true,
  });

  const completion = await (async () => {
    if (result.type === "none-stream") {
      return result.value;
    }
    return ChatGptCompletionMessageUtil.merge(await StreamUtil.readAll(result.value));
  })();

  // ----
  // VALIDATION
  // ----
  if (retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)) {
    const failures: IFailure[] = [];
    for (const choice of completion.choices) {
      for (const tc of choice.message.tool_calls ?? []) {
        if (tc.type !== "function" || tc.function.name !== "cancelFunctions") {
          continue;
        }

        const input: object = JsonUtil.parse(tc.function.arguments) as object;
        const validation: IValidation<__IChatFunctionReference.IProps>
          = typia.validate<__IChatFunctionReference.IProps>(input);
        if (validation.success === false) {
          failures.push({
            id: tc.id,
            name: tc.function.name,
            validation,
          });
        }
      }
    }
    if (failures.length > 0) {
      return step(ctx, operations, retry, failures);
    }
  }

  // ----
  // PROCESS COMPLETION
  // ----
  for (const choice of completion.choices) {
    // TOOL CALLING HANDLER
    if (choice.message.tool_calls != null) {
      for (const tc of choice.message.tool_calls) {
        if (tc.type !== "function") {
          continue;
        }
        else if (tc.function.name !== "cancelFunctions") {
          continue;
        }

        const input: __IChatFunctionReference.IProps | null
          = typia.json.isParse<
            __IChatFunctionReference.IProps
          >(tc.function.arguments);
        if (input === null) {
          continue;
        }

        for (const reference of input.functions) {
          cancelFunctionFromContext(ctx, reference);
        }
      }
    }
  }
}

function emendMessages(failures: IFailure[]): OpenAI.ChatCompletionMessageParam[] {
  return failures
    .map(f => [
        {
          role: "assistant",
          tool_calls: [
            {
              type: "function",
              id: f.id,
              function: {
                name: f.name,
                arguments: JSON.stringify(f.validation.data),
              },
            },
          ],
        } satisfies OpenAI.ChatCompletionAssistantMessageParam,
        {
          role: "tool",
          content: JSON.stringify(f.validation.errors),
          tool_call_id: f.id,
        } satisfies OpenAI.ChatCompletionToolMessageParam,
        {
          role: "system",
          content: [
            "You A.I. assistant has composed wrong typed arguments.",
            "",
            "Correct it at the next function calling.",
          ].join("\n"),
        } satisfies OpenAI.ChatCompletionSystemMessageParam,
    ])
    .flat();
}
