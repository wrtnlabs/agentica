import type { ILlmApplication, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";
import type { IValidation } from "typia";

import typia from "typia";
import { v4 } from "uuid";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { __IChatCancelFunctionsApplication } from "../context/internal/__IChatCancelFunctionsApplication";
import type { __IChatFunctionReference } from "../context/internal/__IChatFunctionReference";
import type { AgenticaEvent } from "../events/AgenticaEvent";
import type { AgenticaCancelHistory } from "../histories/AgenticaCancelHistory";

import { AgenticaConstant } from "../constants/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { createCancelHistory, decodeHistory, decodeUserMessageContent } from "../factory/histories";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { StreamUtil } from "../utils/StreamUtil";

import { cancelFunction } from "./internal/cancelFunction";

const CONTAINER: ILlmApplication<"chatgpt"> = typia.llm.application<
  __IChatCancelFunctionsApplication,
  "chatgpt"
>();

interface IFailure {
  id: string;
  name: string;
  validation: IValidation.IFailure;
}

export async function cancel<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model>,
): Promise<AgenticaCancelHistory<Model>[]> {
  if (ctx.operations.divided === undefined) {
    return step(ctx, ctx.operations.array, 0);
  }

  const stacks: AgenticaOperationSelection<Model>[][]
      = ctx.operations.divided.map(() => []);
  const events: AgenticaEvent<Model>[] = [];
  const prompts: AgenticaCancelHistory<Model>[][] = await Promise.all(
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

  // NO FUNCTION SELECTION, SO THAT ONLY TEXT LEFT
  if (stacks.every(s => s.length === 0)) {
    return prompts[0]!;
  }
  // ELITICISM
  else if ((ctx.config?.eliticism ?? AgenticaConstant.ELITICISM) === true) {
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

  // RE-COLLECT SELECT FUNCTION EVENTS
  const collection: AgenticaCancelHistory<Model> = createCancelHistory({
    id: v4(),
    selections: [],
  });
  for (const e of events) {
    if (e.type === "select") {
      collection.selections.push(e.selection);
      cancelFunction(ctx, {
        name: e.selection.operation.name,
        reason: e.selection.reason,
      });
    }
  }
  return [collection];
}

async function step<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model>,
  operations: AgenticaOperation<Model>[],
  retry: number,
  failures?: IFailure[],
): Promise<AgenticaCancelHistory<Model>[]> {
  // ----
  // EXECUTE CHATGPT API
  // ----
  const completionStream = await ctx.request("cancel", {
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
      : {
          type: "function",
          function: {
            name: CONTAINER.functions[0]!.name,
          },
        },
    parallel_tool_calls: true,
  });

  const chunks = await StreamUtil.readAll(completionStream);
  const completion = ChatGptCompletionMessageUtil.merge(chunks);

  // ----
  // VALIDATION
  // ----
  if (retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)) {
    const failures: IFailure[] = [];
    for (const choice of completion.choices) {
      for (const tc of choice.message.tool_calls ?? []) {
        if (tc.function.name !== "cancelFunctions") {
          continue;
        }

        const input = JSON.parse(tc.function.arguments) as object;
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
  const prompts: AgenticaCancelHistory<Model>[] = [];
  for (const choice of completion.choices) {
    // TOOL CALLING HANDLER
    if (choice.message.tool_calls != null) {
      for (const tc of choice.message.tool_calls) {
        if (tc.type !== "function") {
          continue;
        }

        if (tc.function.name !== "cancelFunctions") {
          continue;
        }

        const input = typia.json.isParse<__IChatFunctionReference.IProps>(tc.function.arguments);
        if (input === null) {
          continue;
        }

        const collection: AgenticaCancelHistory<Model> = createCancelHistory({
          id: tc.id,
          selections: [],
        });

        for (const reference of input.functions) {
          const operation = cancelFunction(ctx, reference);
          if (operation !== null) {
            collection.selections.push(operation);
          }
        }

        if (collection.selections.length !== 0) {
          prompts.push(collection);
        }
      }
    }
  }
  return prompts;
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
