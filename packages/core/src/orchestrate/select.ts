import type { IJsonParseResult } from "@typia/interface";
import type OpenAI from "openai";
import type { ILlmFunction, IValidation } from "typia";

import { dedent, LlmJson } from "@typia/utils";
import typia from "typia";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import type { __IChatFunctionReference } from "../context/internal/__IChatFunctionReference";
import type { __IChatSelectFunctionsApplication } from "../context/internal/__IChatSelectFunctionsApplication";
import type { AgenticaAssistantMessageEvent, AgenticaSelectEvent } from "../events";
import type { AgenticaEvent } from "../events/AgenticaEvent";
import type { AgenticaOperationSearchResult } from "../selector/AgenticaOperationIndex";
import type { IAgenticaSelectorConfig } from "../structures/IAgenticaSelectorConfig";

import { AgenticaConstant } from "../constants/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { createAssistantMessageEvent } from "../factory/events";
import { decodeHistory, decodeUserMessageContent } from "../factory/histories";
import { AgenticaOperationIndex } from "../selector/AgenticaOperationIndex";
import { __get_retry } from "../utils/__retry";
import { AssistantMessageEmptyError, AssistantMessageEmptyWithReasoningError } from "../utils/AssistantMessageEmptyError";
import { ChatGptAssistantMessageUtil } from "../utils/ChatGptAssistantMessageUtil";
import { reduceStreamingWithDispatch } from "../utils/ChatGptCompletionStreamingUtil";
import { toAsyncGenerator } from "../utils/StreamUtil";

import { selectFunctionFromContext } from "./internal/selectFunctionFromContext";

const FUNCTION: ILlmFunction = typia.llm.application<
  __IChatSelectFunctionsApplication
>().functions[0]!;
const AUTO_THRESHOLD_CHARACTERS = 24_000;

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

export async function select(
  ctx: AgenticaContext,
): Promise<void> {
  const local: ILocalSelection | undefined = prepareLocalSelection(ctx);
  if (local !== undefined) {
    if (local.results.length === 0) {
      return;
    }
    if (
      local.mode === "local"
      || local.results.some(result => result.direct)
    ) {
      return selectLocal(ctx, local.results);
    }
    return step(
      ctx,
      local.results.map(result => result.operation),
      0,
    );
  }

  return selectByLlm(ctx);
}

async function selectByLlm(
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
    const selected: AgenticaSelectEvent[]
      = events.filter(e => e.type === "select");
    (selected.length !== 0 ? selected : events)
      .forEach((e) => {
        void ctx.dispatch(e).catch(() => {});
      });
  }
}

interface ILocalSelection {
  mode: "local" | "hybrid";
  results: AgenticaOperationSearchResult[];
}

function prepareLocalSelection(
  ctx: AgenticaContext,
): ILocalSelection | undefined {
  const config: IAgenticaSelectorConfig | undefined = ctx.config?.selector;
  const type: IAgenticaSelectorConfig["type"] = config?.type ?? "llm";
  if (type === "llm" || type === "standard") {
    return undefined;
  }

  const index: AgenticaOperationIndex = new AgenticaOperationIndex({
    operations: ctx.operations.array,
  });
  if (
    type === "auto"
    && index.estimateSchemaCharacters()
    < (config?.autoThresholdCharacters ?? AUTO_THRESHOLD_CHARACTERS)
  ) {
    return undefined;
  }

  const results: AgenticaOperationSearchResult[] = index.search(
    getLocalSearchQuery(ctx),
    {
      topK: config?.topK,
      minScore: config?.minScore,
    },
  );
  if (results.length === 0 && (config?.fallback ?? "llm") === "llm") {
    return undefined;
  }

  return {
    mode: type === "local" ? "local" : "hybrid",
    results,
  };
}

function getLocalSearchQuery(ctx: AgenticaContext): string {
  const previous: string[] = ctx.histories
    .filter(history => history.type === "userMessage")
    .slice(-3)
    .flatMap(history => history.contents)
    .filter(content => content.type === "text")
    .map(content => content.text);
  const prompt: string[] = ctx.prompt.contents
    .filter(content => content.type === "text")
    .map(content => content.text);
  return [...previous, ...prompt].join("\n");
}

function selectLocal(
  ctx: AgenticaContext,
  results: AgenticaOperationSearchResult[],
): void {
  const selected: Set<string> = new Set(ctx.stack.map(s => s.operation.name));
  for (const result of results) {
    if (selected.has(result.operation.name)) {
      continue;
    }
    selected.add(result.operation.name);
    selectFunctionFromContext(ctx, {
      name: result.operation.name,
      reason: result.direct
        ? result.reason
        : `Local selector ${result.reason}.`,
    });
  }
}

async function step(
  ctx: AgenticaContext,
  operations: AgenticaOperation[],
  retry: number,
  failures?: IFailure[],
): Promise<void> {
  const _retryFn = __get_retry(1);
  const retryFn = async (fn: (prevError?: unknown) => Promise<OpenAI.ChatCompletion>) => {
    return _retryFn(fn).catch((e) => {
      if (e instanceof AssistantMessageEmptyError) {
        return Symbol("emptyAssistantMessage");
      }
      throw e;
    });
  };
  // ----
  // EXECUTE CHATGPT API
  // ----
  const completion = await retryFn(async (prevError) => {
    const result = await ctx.request("select", {
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
        // PREVIOUS ERROR
        ...(prevError instanceof AssistantMessageEmptyWithReasoningError
          ? [
          {
            role: "assistant",
            content: prevError.reasoning,
          } satisfies OpenAI.ChatCompletionMessageParam,
            ]
          : []),
        // SYSTEM PROMPT
        {
          role: "system",
          content:
            ctx.config?.systemPrompt?.select?.(ctx.histories)
            ?? AgenticaSystemPrompt.SELECT,
        },
        // TYPE CORRECTIONS
        ...emendMessages(failures ?? []),
        // COMMON SYSTEM PROMPT
        {
          role: "system",
          content: AgenticaDefaultPrompt.write(ctx.config),
        } satisfies OpenAI.ChatCompletionSystemMessageParam,
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
          parameters: FUNCTION.parameters as unknown as Record<string, unknown>,
        },
      } satisfies OpenAI.ChatCompletionTool],
      tool_choice: retry === 0
        ? "auto"
        : "required",
      // parallel_tool_calls: false,
    });

    if (result.type === "none-stream") {
      const completion = result.value;
      const allAssistantMessagesEmpty = !!completion.choices?.every(v => v.message.tool_calls == null && v.message.content === "");
      if (allAssistantMessagesEmpty) {
        const firstChoice = completion.choices?.[0];
        if ((firstChoice?.message as { reasoning?: string })?.reasoning != null) {
          throw new AssistantMessageEmptyWithReasoningError((firstChoice?.message as { reasoning?: string })?.reasoning ?? "");
        }
        throw new AssistantMessageEmptyError();
      }
      return completion;
    }

    const completion = await reduceStreamingWithDispatch(result.value, (props) => {
      const event: AgenticaAssistantMessageEvent = createAssistantMessageEvent(props);
      void ctx.dispatch(event).catch(() => {});
    }, ctx.abortSignal);
    const allAssistantMessagesEmpty = !!completion.choices?.every(v => v.message.tool_calls == null && v.message.content === "");
    if (allAssistantMessagesEmpty) {
      const firstChoice = completion.choices?.[0];
      if ((firstChoice?.message as { reasoning?: string })?.reasoning != null) {
        throw new AssistantMessageEmptyWithReasoningError((firstChoice?.message as { reasoning?: string })?.reasoning ?? "");
      }
      throw new AssistantMessageEmptyError();
    }
    return completion;
  });

  if (typeof completion === "symbol") {
    const event: AgenticaAssistantMessageEvent = createAssistantMessageEvent({
      stream: toAsyncGenerator(""),
      done: () => true,
      get: () => "",
      join: async () => {
        return "";
      },
    });
    void ctx.dispatch(event).catch(() => {});
    return;
  }
  // ----
  // VALIDATION
  // ----
  if (retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)) {
    const failures: IFailure[] = [];
    for (const choice of (completion.choices ?? [])) {
      for (const tc of choice.message.tool_calls ?? []) {
        if (tc.type !== "function" || tc.function.name !== "selectFunctions") {
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
          continue;
        }

        // FUNCTION EXISTENCE
        //
        // `typia` only proves that `name` is a `string`; it cannot know which
        // functions exist at runtime. A hallucinated name would otherwise be
        // silently dropped by `selectFunctionFromContext`, so report it back
        // to the LLM as an `IValidation.IFailure`, just like a type error.
        const referenceErrors: IValidation.IError[] = validateFunctionExistence(
          operations,
          validation.data,
        );
        if (referenceErrors.length > 0) {
          failures.push({
            kind: "validation",
            id: tc.id,
            name: tc.function.name,
            validation: {
              success: false,
              data: validation.data,
              errors: referenceErrors,
            },
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
    // FUNCTION CALLING
    if (choice.message.tool_calls != null) {
      for (const tc of choice.message.tool_calls) {
        if (tc.type !== "function") {
          continue;
        }
        else if (tc.function.name !== "selectFunctions") {
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
          selectFunctionFromContext(
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

/**
 * Validate that every selected function actually exists.
 *
 * `typia` validation only proves that `__IChatFunctionReference.name` is a
 * `string`; it cannot know which functions exist at runtime. Without this
 * check a hallucinated name would be silently dropped by
 * `selectFunctionFromContext`. The returned errors are fed back to the LLM
 * through `emendMessages`, exactly like a type validation error - with the
 * list of valid function names in `expected`.
 */
function validateFunctionExistence(
  candidates: AgenticaOperation[],
  data: __IChatFunctionReference.IProps,
): IValidation.IError[] {
  const expected: string = candidates
    .map(op => JSON.stringify(op.name))
    .join(" | ");
  return data.functions.flatMap((reference, i): IValidation.IError[] =>
    candidates.some(candidate => candidate.name === reference.name)
      ? []
      : [{
          path: `$input.functions[${i}].name`,
          expected,
          value: reference.name,
          description: [
            `Function "${reference.name}" does not exist.`,
            "Select only from the functions provided by getApiFunctions().",
          ].join(" "),
        }],
  );
}
