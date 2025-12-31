import type {
  IHttpResponse,
  ILlmSchema,
  IValidation,
} from "@samchon/openapi";
import type OpenAI from "openai";

import { HttpLlm } from "@samchon/openapi";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { MicroAgenticaContext } from "../context/MicroAgenticaContext";
import type { AgenticaAssistantMessageEvent, AgenticaValidateEvent } from "../events";
import type { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import type { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import type { AgenticaJsonParseErrorEvent } from "../events/AgenticaJsonParseErrorEvent";
import type { MicroAgenticaHistory } from "../histories/MicroAgenticaHistory";

import { AgenticaConstant } from "../constants/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../constants/AgenticaSystemPrompt";
import { isAgenticaContext } from "../context/internal/isAgenticaContext";
import { createAssistantMessageEvent, createCallEvent, createExecuteEvent, createJsonParseErrorEvent, createValidateEvent } from "../factory/events";
import { decodeHistory, decodeUserMessageContent } from "../factory/histories";
import { __get_retry } from "../utils/__retry";
import { AssistantMessageEmptyError, AssistantMessageEmptyWithReasoningError } from "../utils/AssistantMessageEmptyError";
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { reduceStreamingWithDispatch } from "../utils/ChatGptCompletionStreamingUtil";
import { JsonUtil } from "../utils/JsonUtil";
import { StreamUtil, toAsyncGenerator } from "../utils/StreamUtil";
import { stringifyValidateFailure } from "../utils/stringifyValidateFailure";

import { cancelFunctionFromContext } from "./internal/cancelFunctionFromContext";

export async function call(
  ctx: AgenticaContext | MicroAgenticaContext,
  operations: AgenticaOperation[],
): Promise<AgenticaExecuteEvent[]> {
  const _retryFn = __get_retry(1);
  const retryFn = async (fn: (prevError?: unknown) => Promise<OpenAI.ChatCompletion>) => {
    return _retryFn(fn).catch((e) => {
      if (e instanceof AssistantMessageEmptyError) {
        return Symbol("emptyAssistantMessage");
      }
      throw e;
    });
  };

  const completion = await retryFn(async (prevError) => {
    const stream: ReadableStream<OpenAI.ChatCompletionChunk> = await ctx.request("call", {
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
        ...(prevError instanceof AssistantMessageEmptyWithReasoningError
          ? [
          {
            role: "assistant",
            content: prevError.reasoning,
          } satisfies OpenAI.ChatCompletionMessageParam,
            ]
          : []),
        // SYSTEM PROMPT
        ...(ctx.config?.systemPrompt?.execute === null
          ? []
          : [{
            role: "system",
            content: ctx.config?.systemPrompt?.execute?.(ctx.histories as MicroAgenticaHistory[])
              ?? AgenticaSystemPrompt.EXECUTE,
          } satisfies OpenAI.ChatCompletionSystemMessageParam]),
      ],
      // STACKED FUNCTIONS
      tools: operations.map(
        s =>
          ({
            type: "function",
            function: {
              name: s.name,
              description: s.function.description,
              parameters: (
                "separated" in s.function
                && s.function.separated !== undefined
                  ? (s.function.separated.llm
                    ?? ({
                      type: "object",
                      properties: {},
                      required: [],
                      additionalProperties: false,
                      $defs: {},
                    } satisfies ILlmSchema.IParameters))
                  : s.function.parameters) as Record<string, any>,
            },
          }) as OpenAI.ChatCompletionTool,
      ),
      tool_choice: "auto",
      // parallel_tool_calls: false,
    });

    const completion = await reduceStreamingWithDispatch(stream, (props) => {
      const event: AgenticaAssistantMessageEvent = createAssistantMessageEvent(props);
      void ctx.dispatch(event).catch(() => {});
    });

    const allAssistantMessagesEmpty = completion.choices.every(v => v.message.tool_calls == null && v.message.content === "");
    if (allAssistantMessagesEmpty) {
      const firstChoice = completion.choices.at(0);
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
    return [];
  }

  const executes: AgenticaExecuteEvent[] = [];

  const retry: number = ctx.config?.retry ?? AgenticaConstant.RETRY;
  for (const choice of completion.choices) {
    for (const tc of choice.message.tool_calls ?? []) {
      if (tc.type === "function") {
        const operation: AgenticaOperation | undefined = operations.find(
          s => s.name === tc.function.name,
        );
        if (operation === undefined) {
          continue; // Ignore unknown tool calls
        }
        const event: AgenticaExecuteEvent = await predicate(
          ctx,
          operation,
          tc,
          [],
          retry,
        );
        await ctx.dispatch(event);
        executes.push(event);
        if (isAgenticaContext(ctx)) {
          cancelFunctionFromContext(ctx as unknown as AgenticaContext, {
            name: event.operation.name,
            reason: "completed",
          });
        }
      }
    }
  }
  return executes;
}

async function predicate(
  ctx: AgenticaContext | MicroAgenticaContext,
  operation: AgenticaOperation,
  toolCall: OpenAI.ChatCompletionMessageFunctionToolCall,
  previousValidationErrors: AgenticaValidateEvent[],
  life: number,
): Promise<AgenticaExecuteEvent> {
  // CHECK INPUT ARGUMENT
  const call: AgenticaCallEvent | AgenticaJsonParseErrorEvent
    = parseArguments(
      operation,
      toolCall,
      life,
    );
  await ctx.dispatch(call);
  if (call.type === "jsonParseError") {
    return correctJsonError(ctx, toolCall, call, previousValidationErrors, life - 1);
  }

  // CHECK TYPE VALIDATION
  const check: IValidation<unknown> = operation.function.validate(call.arguments);
  if (check.success === false) {
    const event: AgenticaValidateEvent = createValidateEvent({
      call_id: toolCall.id,
      operation,
      result: check,
      life,
    });
    await ctx.dispatch(event);
    return correctTypeError(
      ctx,
      call,
      event,
      [...previousValidationErrors, event],
      life - 1,
    );
  }

  // EXECUTE OPERATION
  return executeFunction(call, operation);
}

/* -----------------------------------------------------------
  ERROR CORRECTORS
----------------------------------------------------------- */
async function correctTypeError(
  ctx: AgenticaContext | MicroAgenticaContext,
  callEvent: AgenticaCallEvent,
  validateEvent: AgenticaValidateEvent,
  previousValidationErrors: AgenticaValidateEvent[],
  life: number,
): Promise<AgenticaExecuteEvent> {
  return correctError(ctx, {
    giveUp: () => createExecuteEvent({
      call_id: callEvent.id,
      operation: callEvent.operation,
      arguments: callEvent.arguments,
      value: {
        name: "ValidationError",
        message: `Invalid arguments. The validation failed after ${AgenticaConstant.RETRY} retries.`,
        errors: validateEvent.result.errors,
      },
      success: false,
    }),
    operation: callEvent.operation,
    toolCall: {
      id: callEvent.id,
      arguments: JSON.stringify(callEvent.arguments),
      result: [
        "🚨 VALIDATION FAILURE: Your function arguments do not conform to the required schema.",
        "",
        "The validation errors below represent computed absolute truth from rigorous type validation.",
        "Each error is marked with ❌ comments showing the exact location, expected type, and actual value.",
        "",
        "You must fix ALL errors to achieve 100% schema compliance.",
        "",
        "```json",
        stringifyValidateFailure(validateEvent.result),
        "```",
      ].join("\n"),
    },
    systemPrompt: ctx.config?.systemPrompt?.validate?.(previousValidationErrors.slice(0, -1))
      ?? [
        AgenticaSystemPrompt.VALIDATE,
        ...(previousValidationErrors.length > 1
          ? [
              "",
              AgenticaSystemPrompt.VALIDATE_REPEATED.replace(
                "${{HISTORICAL_ERRORS}}",
                previousValidationErrors
                  .slice(0, -1)
                  .map((ve, i) => [
                    `### ${i + 1}. Previous Validation Error`,
                    "",
                    "```json",
                    stringifyValidateFailure(ve.result),
                    "```",
                  ].join("\n"))
                  .join("\n\n"),
                // JSON.stringify(previousValidationErrors.slice(0, -1).map(e => e.result.errors)),
              ),
            ]
          : []),
      ].join("\n"),
    life,
    previousValidationErrors,
  });
}

async function correctJsonError(
  ctx: AgenticaContext | MicroAgenticaContext,
  toolCall: OpenAI.ChatCompletionMessageFunctionToolCall,
  parseErrorEvent: AgenticaJsonParseErrorEvent,
  previousValidationErrors: AgenticaValidateEvent[],
  life: number,
): Promise<AgenticaExecuteEvent> {
  return correctError(ctx, {
    giveUp: () => createExecuteEvent({
      call_id: toolCall.id,
      operation: parseErrorEvent.operation,
      arguments: {},
      value: {
        name: "JsonParseError",
        message: `Invalid JSON format. The parsing failed after ${AgenticaConstant.RETRY} retries.`,
        arguments: parseErrorEvent.arguments,
        errorMessage: parseErrorEvent.errorMessage,
      },
      success: false,
    }),
    operation: parseErrorEvent.operation,
    toolCall: {
      id: parseErrorEvent.id,
      arguments: parseErrorEvent.arguments,
      result: parseErrorEvent.errorMessage,
    },
    systemPrompt: ctx.config?.systemPrompt?.jsonParseError?.(parseErrorEvent)
      ?? AgenticaSystemPrompt.JSON_PARSE_ERROR.replace(
        "${{ERROR_MESSAGE}}",
        parseErrorEvent.errorMessage,
      ),
    life,
    previousValidationErrors,
  });
}

function parseArguments(
  operation: AgenticaOperation,
  toolCall: OpenAI.ChatCompletionMessageFunctionToolCall,
  life: number,
): AgenticaCallEvent | AgenticaJsonParseErrorEvent {
  try {
    const data: Record<string, unknown> = JsonUtil.parse(toolCall.function.arguments);
    return createCallEvent({
      id: toolCall.id,
      operation,
      arguments: data,
    });
  }
  catch (error) {
    return createJsonParseErrorEvent({
      call_id: toolCall.id,
      operation,
      arguments: toolCall.function.arguments,
      errorMessage: error instanceof Error ? error.message : String(error),
      life,
    });
  }
}

async function correctError(
  ctx: AgenticaContext | MicroAgenticaContext,
  props: {
    giveUp: () => AgenticaExecuteEvent;
    operation: AgenticaOperation;
    toolCall: {
      id: string;
      arguments: string;
      result: string;
    };
    systemPrompt: string;
    life: number;
    previousValidationErrors: AgenticaValidateEvent[];
  },
): Promise<AgenticaExecuteEvent> {
  if (props.life <= 0) {
    return props.giveUp();
  }

  const stream: ReadableStream<OpenAI.ChatCompletionChunk> = await ctx.request("call", {
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
      // TYPE CORRECTION
      {
        role: "system",
        content:
        ctx.config?.systemPrompt?.execute?.(ctx.histories as MicroAgenticaHistory[])
        ?? AgenticaSystemPrompt.EXECUTE,
      },
      {
        role: "assistant",
        tool_calls: [
          {
            type: "function",
            id: props.toolCall.id,
            function: {
              name: props.operation.name,
              arguments: props.toolCall.arguments,
            },
          } satisfies OpenAI.ChatCompletionMessageFunctionToolCall,
        ],
      } satisfies OpenAI.ChatCompletionAssistantMessageParam,
      {
        role: "tool",
        content: props.toolCall.result,
        tool_call_id: props.toolCall.id,
      },
      {
        role: "system",
        content: props.systemPrompt,
      },
    ],
    // STACK FUNCTIONS
    tools: [
      {
        type: "function",
        function: {
          name: props.operation.name,
          description: props.operation.function.description,
          /**
           * @TODO fix it
           * The property and value have a type mismatch, but it works.
           */
          parameters: (
            ("separated" in props.operation.function
              && props.operation.function.separated !== undefined)
              ? (props.operation.function.separated?.llm
                ?? ({
                  $defs: {},
                  type: "object",
                  properties: {},
                  additionalProperties: false,
                  required: [],
                } satisfies ILlmSchema.IParameters))

              : props.operation.function.parameters) as unknown as Record<string, unknown>,
        },
      },
    ],
    tool_choice: "required",
    // parallel_tool_calls: false,
  });
  const chunks: OpenAI.ChatCompletionChunk[] = await StreamUtil.readAll(stream);
  const completion: OpenAI.ChatCompletion = ChatGptCompletionMessageUtil.merge(chunks);
  const toolCall: OpenAI.ChatCompletionMessageFunctionToolCall | undefined = completion.choices[0]?.message.tool_calls?.filter(
    tc => tc.type === "function",
  ).find(
    s => s.function.name === props.operation.name,
  );
  return toolCall === undefined
    ? props.giveUp()
    : predicate(
        ctx,
        props.operation,
        toolCall,
        props.previousValidationErrors,
        props.life,
      );
}

/* -----------------------------------------------------------
  FUNCTION EXECUTORS
----------------------------------------------------------- */
async function executeFunction(
  call: AgenticaCallEvent,
  operation: AgenticaOperation,
): Promise<AgenticaExecuteEvent> {
  try {
    const value: unknown = await (async () => {
      switch (operation.protocol) {
        case "class":
          return executeClassFunction(call, operation);
        case "http":
          return executeHttpOperation(call, operation);
        case "mcp":
          return executeMcpOperation(call, operation);
        default:
          operation satisfies never; // Ensure all cases are handled
          throw new Error("Unknown protocol"); // never be happen
      }
    })();
    return createExecuteEvent({
      call_id: call.id,
      operation: call.operation,
      arguments: call.arguments,
      value,
      success: true,
    });
  }
  catch (error) {
    return createExecuteEvent({
      call_id: call.id,
      operation: call.operation,
      arguments: call.arguments,
      value: error instanceof Error
        ? {
            ...error,
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : error,
      success: false,
    });
  }
}

async function executeClassFunction(
  call: AgenticaCallEvent,
  operation: AgenticaOperation.Class,
): Promise<unknown> {
  const execute = operation.controller.execute;
  const value: unknown = typeof execute === "function"
    ? await execute({
      application: operation.controller.application,
      function: operation.function,
      arguments: call.arguments,
    })
    : await (execute as Record<string, any>)[operation.function.name](
      call.arguments,
    );
  return value;
}

async function executeHttpOperation(
  call: AgenticaCallEvent,
  operation: AgenticaOperation.Http,
): Promise<unknown> {
  const execute = operation.controller.execute;
  const value: IHttpResponse = typeof execute === "function"
    ? await execute({
      connection: operation.controller.connection,
      application: operation.controller.application,
      function: operation.function,
      arguments: call.arguments,
    })
    : await HttpLlm.propagate({
      connection: operation.controller.connection,
      application: operation.controller.application,
      function: operation.function,
      input: call.arguments,
    });
  return value;
}

async function executeMcpOperation(
  call: AgenticaCallEvent,
  operation: AgenticaOperation.Mcp,
): Promise<unknown> {
  return operation.controller.client.callTool({
    method: operation.function.name,
    name: operation.function.name,
    arguments: call.arguments,
  }).then(v => v.content);
}
