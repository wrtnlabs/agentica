import type {
  IChatGptSchema,
  IHttpResponse,
  ILlmSchema,
  IValidation,
} from "@samchon/openapi";
import type OpenAI from "openai";

import { HttpLlm } from "@samchon/openapi";
import { v4 } from "uuid";

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
import { ChatGptCompletionMessageUtil } from "../utils/ChatGptCompletionMessageUtil";
import { StreamUtil, toAsyncGenerator } from "../utils/StreamUtil";

import { cancelFunctionFromContext } from "./internal/cancelFunctionFromContext";

export async function call<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
  operations: AgenticaOperation<Model>[],
): Promise<AgenticaExecuteEvent<Model>[]> {
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
      // SYSTEM PROMPT
      ...(ctx.config?.systemPrompt?.execute === null
        ? []
        : [{
          role: "system",
          content: ctx.config?.systemPrompt?.execute?.(ctx.histories as MicroAgenticaHistory<Model>[])
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
                  } satisfies IChatGptSchema.IParameters))

                : s.function.parameters) as Record<string, any>,
          },
        }) as OpenAI.ChatCompletionTool,
    ),
    tool_choice: "auto",
    // parallel_tool_calls: false,
  });
  const chunks: OpenAI.ChatCompletionChunk[] = await StreamUtil.readAll(stream);
  const completion: OpenAI.ChatCompletion = ChatGptCompletionMessageUtil.merge(chunks);
  const executes: AgenticaExecuteEvent<Model>[] = [];

  for (const choice of completion.choices) {
    for (const tc of choice.message.tool_calls ?? []) {
      if (tc.type === "function") {
        const operation: AgenticaOperation<Model> | undefined = operations.find(
          s => s.name === tc.function.name,
        );
        if (operation === undefined) {
          continue; // Ignore unknown tool calls
        }
        const event: AgenticaExecuteEvent<Model> = await predicate(
          ctx,
          operation,
          tc,
          [],
          ctx.config?.retry ?? AgenticaConstant.RETRY,
        );
        ctx.dispatch(event);
        executes.push(event);
        if (isAgenticaContext(ctx)) {
          cancelFunctionFromContext(ctx, {
            name: event.operation.name,
            reason: "completed",
          });
        }
      }
    }
    if (
      choice.message.role === "assistant"
      && choice.message.content != null
      && choice.message.content.length !== 0
    ) {
      const text: string = choice.message.content;
      const event: AgenticaAssistantMessageEvent = createAssistantMessageEvent({
        get: () => text,
        done: () => true,
        stream: toAsyncGenerator(text),
        join: async () => Promise.resolve(text),
      });
      ctx.dispatch(event);
    }
  }
  return executes;
}

async function predicate<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
  operation: AgenticaOperation<Model>,
  toolCall: OpenAI.ChatCompletionMessageToolCall,
  previousValidationErrors: AgenticaValidateEvent<Model>[],
  life: number,
): Promise<AgenticaExecuteEvent<Model>> {
  // CHECK INPUT ARGUMENT
  const call: AgenticaCallEvent<Model> | AgenticaJsonParseErrorEvent<Model>
    = parseArguments(
      operation,
      toolCall,
    );
  ctx.dispatch(call);
  if (call.type === "jsonParseError") {
    return correctJsonError(ctx, call, previousValidationErrors, life - 1);
  }

  // CHECK TYPE VALIDATION
  const check: IValidation<unknown> = operation.function.validate(call.arguments);
  if (check.success === false) {
    const event: AgenticaValidateEvent<Model> = createValidateEvent({
      id: toolCall.id,
      operation,
      result: check,
    });
    ctx.dispatch(event);
    return correctTypeError(
      ctx,
      call,
      event,
      [...previousValidationErrors, event],
      life - 1,
    );
  }

  // EXECUTE OPERATION
  const execute: AgenticaExecuteEvent<Model> = await executeFunction(call, operation);
  ctx.dispatch(execute);
  return execute;
}

/* -----------------------------------------------------------
  ERROR CORRECTORS
----------------------------------------------------------- */
async function correctTypeError<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
  callEvent: AgenticaCallEvent<Model>,
  validateEvent: AgenticaValidateEvent<Model>,
  previousValidationErrors: AgenticaValidateEvent<Model>[],
  life: number,
): Promise<AgenticaExecuteEvent<Model>> {
  return correctError<Model>(ctx, {
    giveUp: () => createExecuteEvent({
      operation: callEvent.operation,
      arguments: callEvent.arguments,
      value: {
        name: "ValidationError",
        message: `Invalid arguments. The validation failed after ${AgenticaConstant.RETRY} retries.`,
        errors: validateEvent.result.errors,
      },
    }),
    operation: callEvent.operation,
    messageArguments: JSON.stringify(callEvent.arguments),
    messageToolParam: {
      role: "tool",
      content: JSON.stringify(validateEvent.result.errors),
      tool_call_id: callEvent.id,
    } satisfies OpenAI.ChatCompletionToolMessageParam,
    systemPrompt: ctx.config?.systemPrompt?.validate?.(previousValidationErrors.slice(0, -1))
      ?? [
        AgenticaSystemPrompt.VALIDATE,
        ...(previousValidationErrors.length > 1
          ? [
              "",
              AgenticaSystemPrompt.VALIDATE_REPEATED.replace(
                "${{HISTORICAL_ERRORS}}",
                JSON.stringify(previousValidationErrors.slice(0, -1).map(e => e.result.errors)),
              ),
            ]
          : []),
      ].join("\n"),
    life,
    previousValidationErrors,
  });
}

async function correctJsonError<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
  parseErrorEvent: AgenticaJsonParseErrorEvent<Model>,
  previousValidationErrors: AgenticaValidateEvent<Model>[],
  life: number,
): Promise<AgenticaExecuteEvent<Model>> {
  return correctError<Model>(ctx, {
    giveUp: () => createExecuteEvent({
      operation: parseErrorEvent.operation,
      arguments: {},
      value: {
        name: "JsonParseError",
        message: `Invalid JSON format. The parsing failed after ${AgenticaConstant.RETRY} retries.`,
        arguments: parseErrorEvent.arguments,
        errorMessage: parseErrorEvent.errorMessage,
      },
    }),
    operation: parseErrorEvent.operation,
    messageArguments: parseErrorEvent.arguments,
    messageToolParam: null,
    systemPrompt: ctx.config?.systemPrompt?.jsonParseError?.(parseErrorEvent)
      ?? AgenticaSystemPrompt.JSON_PARSE_ERROR.replace(
        "${{ERROR_MESSAGE}}",
        parseErrorEvent.errorMessage,
      ),
    life,
    previousValidationErrors,
  });
}

function parseArguments<Model extends ILlmSchema.Model>(
  operation: AgenticaOperation<Model>,
  toolCall: OpenAI.ChatCompletionMessageToolCall,
): AgenticaCallEvent<Model> | AgenticaJsonParseErrorEvent<Model> {
  try {
    const data: Record<string, unknown> = JSON.parse(toolCall.function.arguments);
    return createCallEvent({
      id: toolCall.id,
      operation,
      arguments: data,
    });
  }
  catch (error) {
    return createJsonParseErrorEvent({
      id: toolCall.id,
      operation,
      arguments: toolCall.function.arguments,
      errorMessage: error instanceof Error ? error.message : String(error),
    });
  }
}

async function correctError<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model> | MicroAgenticaContext<Model>,
  props: {
    giveUp: () => AgenticaExecuteEvent<Model>;
    operation: AgenticaOperation<Model>;
    messageArguments: string;
    messageToolParam: null | OpenAI.ChatCompletionToolMessageParam;
    systemPrompt: string;
    life: number;
    previousValidationErrors: AgenticaValidateEvent<Model>[];
  },
): Promise<AgenticaExecuteEvent<Model>> {
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
        ctx.config?.systemPrompt?.execute?.(ctx.histories as MicroAgenticaHistory<Model>[])
        ?? AgenticaSystemPrompt.EXECUTE,
      },
      {
        role: "assistant",
        tool_calls: [
          {
            type: "function",
            id: v4(),
            function: {
              name: props.operation.name,
              arguments: props.messageArguments,
            },
          } satisfies OpenAI.ChatCompletionMessageToolCall,
        ],
      } satisfies OpenAI.ChatCompletionAssistantMessageParam,
      ...(props.messageToolParam !== null
        ? [props.messageToolParam]
        : []),
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
                } satisfies IChatGptSchema.IParameters))

              : props.operation.function.parameters) as unknown as Record<string, unknown>,
        },
      },
    ],
    tool_choice: {
      type: "function",
      function: {
        name: props.operation.name,
      },
    },
    // parallel_tool_calls: false,
  });
  const chunks: OpenAI.ChatCompletionChunk[] = await StreamUtil.readAll(stream);
  const completion: OpenAI.ChatCompletion = ChatGptCompletionMessageUtil.merge(chunks);

  const toolCall: OpenAI.ChatCompletionMessageToolCall | undefined = completion.choices[0]?.message.tool_calls?.find(
    s => s.function.name === props.operation.name,
  );
  return toolCall === undefined
    ? props.giveUp()
    : predicate<Model>(
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
async function executeFunction<Model extends ILlmSchema.Model>(
  call: AgenticaCallEvent<Model>,
  operation: AgenticaOperation<Model>,
): Promise<AgenticaExecuteEvent<Model>> {
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
      operation: call.operation,
      arguments: call.arguments,
      value,
    });
  }
  catch (error) {
    return createExecuteEvent({
      operation: call.operation,
      arguments: call.arguments,
      value: error instanceof Error
        ? {
            ...error,
            name: error.name,
            message: error.message,
          }
        : error,
    });
  }
}

async function executeClassFunction<Model extends ILlmSchema.Model>(
  call: AgenticaCallEvent<Model>,
  operation: AgenticaOperation.Class<Model>,
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

async function executeHttpOperation<Model extends ILlmSchema.Model>(
  call: AgenticaCallEvent<Model>,
  operation: AgenticaOperation.Http<Model>,
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

async function executeMcpOperation<Model extends ILlmSchema.Model>(
  call: AgenticaCallEvent<Model>,
  operation: AgenticaOperation.Mcp<Model>,
): Promise<unknown> {
  return operation.controller.client.callTool({
    method: operation.function.name,
    name: operation.function.name,
    arguments: call.arguments,
  }).then(v => v.content);
}
