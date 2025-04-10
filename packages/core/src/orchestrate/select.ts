import type { ILlmApplication, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";
import type { IValidation } from "typia";

import typia from "typia";
import { v4 } from "uuid";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { __IChatFunctionReference } from "../context/internal/__IChatFunctionReference";
import type { __IChatSelectFunctionsApplication } from "../context/internal/__IChatSelectFunctionsApplication";
import type { AgenticaEvent } from "../events/AgenticaEvent";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaSelectHistory } from "../histories/AgenticaSelectHistory";
import type { AgenticaTextHistory } from "../histories/AgenticaTextHistory";

import { AgenticaConstant } from "../constants/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { createTextEvent } from "../factory/events";
import { createSelectHistory, createTextHistory, decodeHistory } from "../factory/histories";
import { createOperationSelection } from "../factory/operations";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { StreamUtil } from "../utils/StreamUtil";

import { selectFunction } from "./internal/selectFunction";

const CONTAINER: ILlmApplication<"chatgpt"> = typia.llm.application<
  __IChatSelectFunctionsApplication,
  "chatgpt"
>();

interface IFailure {
  id: string;
  name: string;
  validation: IValidation.IFailure;
}

export async function select<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<AgenticaHistory<Model>[]> {
  if (ctx.operations.divided === undefined) {
    return step(ctx, ctx.operations.array, 0);
  }

  const stacks: AgenticaOperationSelection<Model>[][]
      = ctx.operations.divided.map(() => []);
  const events: AgenticaEvent<Model>[] = [];
  const prompts: AgenticaHistory<Model>[][] = await Promise.all(
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
  const collection: AgenticaSelectHistory<Model> = createSelectHistory({
    id: v4(),
    selections: [],
  });
  for (const e of events) {
    if (e.type === "select") {
      collection.selections.push(e.selection);
      await selectFunction(ctx, {
        name: e.selection.operation.name,
        reason: e.selection.reason,
      });
    }
  }
  return [collection];
}

async function step<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>, operations: AgenticaOperation<Model>[], retry: number, failures?: IFailure[]): Promise<AgenticaHistory<Model>[]> {
  // ----
  // EXECUTE CHATGPT API
  // ----
  const completionStream = await ctx.request("select", {
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
          content: ctx.prompt.text,
        },
        // SYSTEM PROMPT
        {
          role: "system",
          content:
            ctx.config?.systemPrompt?.select?.(ctx.histories)
            ?? AgenticaSystemPrompt.SELECT,
        },
        // TYPE CORRECTIONS
        ...emendMessages(failures ?? []),
    ],
    // STACK FUNCTIONS
    tools: CONTAINER.functions.map(
      func =>
          ({
            type: "function",
            function: {
              name: func.name,
              description: func.description,
              /**
               * @TODO fix it
               * The property and value have a type mismatch, but it works.
               */
              parameters: func.parameters as unknown as Record<string, unknown>,
            },
          }) satisfies OpenAI.ChatCompletionTool,
    ),
    tool_choice: "auto",
    parallel_tool_calls: false,
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
        if (tc.function.name !== "selectFunctions") {
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
  const prompts: AgenticaHistory<Model>[] = [];
  for (const choice of completion.choices) {
    // TOOL CALLING HANDLER
    if (choice.message.tool_calls != null) {
      for (const tc of choice.message.tool_calls) {
        if (tc.type !== "function") {
          continue;
        }

        if (tc.function.name !== "selectFunctions") {
          continue;
        }
        const input = typia.json.isParse<__IChatFunctionReference.IProps>(tc.function.arguments);

        if (input === null) {
          continue;
        }

        const collection: AgenticaSelectHistory<Model>
              = createSelectHistory({
                id: tc.id,
                selections: [],
              });
        for (const reference of input.functions) {
          const operation: AgenticaOperation<Model> | null
                = await selectFunction(ctx, reference);

          if (operation === null) {
            continue;
          }

          collection.selections.push(
            createOperationSelection({
              operation,
              reason: reference.reason,
            }),
          );
        }

        if (collection.selections.length !== 0) {
          prompts.push(collection);
        }
      }
    }

    // ASSISTANT MESSAGE
    if (
      choice.message.role === "assistant"
      && choice.message.content != null
      && choice.message.content.length !== 0
    ) {
      const text: AgenticaTextHistory = createTextHistory({
        role: "assistant",
        text: choice.message.content,
      });
      prompts.push(text);

      await ctx.dispatch(
        createTextEvent({
          role: "assistant",
          stream: StreamUtil.to(text.text),
          join: async () => Promise.resolve(text.text),
          done: () => true,
          get: () => text.text,
        }),
      );
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
