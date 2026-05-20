import type { IJsonParseResult } from "@typia/interface";
import type OpenAI from "openai";
import type { ILlmFunction, IValidation } from "typia";

import { dedent, LlmJson } from "@typia/utils";
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
import { ChatGptAssistantMessageUtil } from "../utils/ChatGptAssistantMessageUtil";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { StreamUtil } from "../utils/StreamUtil";

import { cancelFunctionFromContext } from "./internal/cancelFunctionFromContext";

const FUNCTION: ILlmFunction = typia.llm.application<
  __IChatCancelFunctionsApplication
>().functions[0]!;

type IFailure
  = | {
    kind: "parse";
    id: string;
    name: string;
    failure: IJsonParseResult.IFailure;
  }
  | {
    kind: "validation";
    id: string;
    name: string;
    validation: IValidation.IFailure;
  };

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
      {
        role: "system",
        content: AgenticaDefaultPrompt.write(ctx.config),
      },
    ],
    // STACK FUNCTIONS
    tools: [{
      type: "function",
      function: {
        name: FUNCTION.name,
        description: FUNCTION.description,
        /**
         * @TODO fix it
         * The property and value have a type mismatch, but it works.
         */
        parameters: FUNCTION.parameters as Record<string, any>,
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
    for (const choice of (completion.choices ?? [])) {
      for (const tc of choice.message.tool_calls ?? []) {
        if (tc.type !== "function" || tc.function.name !== "cancelFunctions") {
          continue;
        }

        // LENIENT JSON PARSING
        //
        // A malformed JSON string is reported back to the LLM as a parse
        // failure, mirroring `call.ts`. On success the parsed `.data` (never
        // the `IJsonParseResult` wrapper itself) is forwarded to validation.
        const parsed: IJsonParseResult<unknown> = FUNCTION.parse(
          tc.function.arguments,
        );
        if (parsed.success === false) {
          failures.push({
            kind: "parse",
            id: tc.id,
            name: tc.function.name,
            failure: parsed,
          });
          continue;
        }
        const validation: IValidation<__IChatFunctionReference.IProps>
          = FUNCTION.validate(parsed.data) as IValidation<__IChatFunctionReference.IProps>;
        if (validation.success === false) {
          failures.push({
            kind: "validation",
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
  for (const choice of (completion.choices ?? [])) {
    const assistant = ChatGptAssistantMessageUtil.collect(choice.message);
    // TOOL CALLING HANDLER
    if (choice.message.tool_calls != null) {
      for (const tc of choice.message.tool_calls) {
        if (tc.type !== "function") {
          continue;
        }
        else if (tc.function.name !== "cancelFunctions") {
          continue;
        }

        // Reuse the lenient parser + validator so that arguments accepted
        // by the VALIDATION retry above are processed consistently here.
        const parsed: IJsonParseResult<unknown> = FUNCTION.parse(
          tc.function.arguments,
        );
        const validation: IValidation<__IChatFunctionReference.IProps>
          = FUNCTION.validate(parsed.data) as IValidation<__IChatFunctionReference.IProps>;
        if (validation.success === false) {
          continue;
        }

        for (const reference of validation.data.functions) {
          cancelFunctionFromContext(
            ctx,
            reference,
            assistant === undefined ? undefined : { assistant },
          );
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
              arguments: f.kind === "parse"
                ? f.failure.input
                : JSON.stringify(f.validation.data),
            },
          },
        ],
      } satisfies OpenAI.ChatCompletionAssistantMessageParam,
      {
        role: "tool",
        tool_call_id: f.id,
        content: f.kind === "parse"
          ? dedent`
              Invalid JSON format.

              Here is the detailed parsing failure information,
              including error messages and their locations within the input:

              \`\`\`json
              ${JSON.stringify(f.failure.errors)}
              \`\`\`

              And here is the partially parsed data that was successfully
              extracted before the error occurred:

              \`\`\`json
              ${JSON.stringify(f.failure.data)}
              \`\`\`
            `
          : [
              "🚨 VALIDATION FAILURE: Your function arguments do not conform to the required schema.",
              "",
              "Each error below is computed absolute truth from rigorous type validation.",
              "You must fix ALL errors to achieve 100% schema compliance.",
              "",
              LlmJson.stringify(f.validation),
            ].join("\n"),
      } satisfies OpenAI.ChatCompletionToolMessageParam,
      {
        role: "system",
        content: f.kind === "parse"
          ? AgenticaSystemPrompt.JSON_PARSE_ERROR.replace(
              "${{FAILURE}}",
              JSON.stringify(f.failure),
            )
          : AgenticaSystemPrompt.VALIDATE,
      } satisfies OpenAI.ChatCompletionSystemMessageParam,
    ])
    .flat();
}
