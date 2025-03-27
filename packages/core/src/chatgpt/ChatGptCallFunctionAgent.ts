import type {
  IChatGptSchema,
  IHttpMigrateRoute,
  IHttpResponse,
  ILlmSchema,
} from "@samchon/openapi";
import type OpenAI from "openai";
import type { IValidation } from "typia";
import type { AgenticaContext } from "../context/AgenticaContext";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import {
  ChatGptTypeChecker,
  HttpLlm,
} from "@samchon/openapi";
import { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";
import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { AgenticaCallEvent } from "../events/AgenticaCallEvent";
import { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import { AgenticaExecuteEvent } from "../events/AgenticaExecuteEvent";
import { AgenticaTextEvent } from "../events/AgenticaTextEvent";
import { AgenticaConstant } from "../internal/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { StreamUtil } from "../internal/StreamUtil";
import { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import { ChatGptCancelFunctionAgent } from "./ChatGptCancelFunctionAgent";
import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export async function execute<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>): Promise<AgenticaPrompt<Model>[]> {
  // ----
  // EXECUTE CHATGPT API
  // ----
  const completionStream = await ctx.request("call", {
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
        // SYSTEM PROMPT
        {
          role: "system",
          content:
            ctx.config?.systemPrompt?.execute?.(ctx.histories)
            ?? AgenticaSystemPrompt.EXECUTE,
        },
    ],
    // STACKED FUNCTIONS
    tools: ctx.stack.map(
      s =>
        ({
          type: "function",
          function: {
            name: s.operation.name,
            description: s.operation.function.description,
            parameters: (s.operation.function.separated !== undefined
              ? (s.operation.function.separated.llm
                ?? ({
                  type: "object",
                  properties: {},
                  required: [],
                  additionalProperties: false,
                  $defs: {},
                } satisfies IChatGptSchema.IParameters))
              : s.operation.function.parameters) as Record<string, any>,
          },
        }) as OpenAI.ChatCompletionTool,
    ),
    tool_choice: "auto",
    parallel_tool_calls: false,
  });

  // ----
  // PROCESS COMPLETION
  // ----
  const closures: Array<
    () => Promise<
      Array<
        | AgenticaExecutePrompt<Model>
        | AgenticaCancelPrompt<Model>
        | AgenticaTextPrompt
      >
    >
  > = [];

  const chunks = await StreamUtil.readAll(completionStream);
  const completion = ChatGptCompletionMessageUtil.merge(chunks);

  for (const choice of completion.choices) {
    for (const tc of choice.message.tool_calls ?? []) {
      if (tc.type === "function") {
        const operation: AgenticaOperation<Model> | undefined
            = ctx.operations.flat.get(tc.function.name);
        if (operation === undefined) {
          continue;
        }
        closures.push(
          async (): Promise<
            [AgenticaExecutePrompt<Model>, AgenticaCancelPrompt<Model>]
          > => {
            const call: AgenticaCallEvent<Model> = new AgenticaCallEvent({
              id: tc.id,
              operation,
              // @TODO add type assertion!
              arguments: JSON.parse(tc.function.arguments) as Record<string, unknown>,
            });
            if (call.operation.protocol === "http") {
              fillHttpArguments({
                operation: call.operation,
                arguments: call.arguments,
              });
            }
            await ctx.dispatch(call);

            const execute: AgenticaExecutePrompt<Model> = await propagate(
              ctx,
              call,
              0,
            );
            await ctx.dispatch(
              new AgenticaExecuteEvent({
                id: call.id,
                operation: call.operation,
                arguments: execute.arguments,
                value: execute.value,
              }),
            );

            await ChatGptCancelFunctionAgent.cancelFunction(ctx, {
              name: call.operation.name,
              reason: "completed",
            });
            await ctx.dispatch(
              new AgenticaCancelEvent({
                selection: new AgenticaOperationSelection({
                  operation: call.operation,
                  reason: "complete",
                }),
              }),
            );
            return [
              execute,
              new AgenticaCancelPrompt({
                id: call.id,
                selections: [
                  new AgenticaOperationSelection({
                    operation: call.operation,
                    reason: "complete",
                  }),
                ],
              }),
            ] as const;
          },
        );
      }
    }
    if (
      choice.message.role === "assistant"
      && choice.message.content !== null
      && choice.message.content.length > 0
    ) {
      closures.push(async () => {
        const value: AgenticaTextPrompt = new AgenticaTextPrompt({
          role: "assistant",
          text: choice.message.content!,
        });
        await ctx.dispatch(
          new AgenticaTextEvent({
            role: "assistant",
            get: () => value.text,
            done: () => true,
            stream: StreamUtil.to(value.text),
            join: async () => Promise.resolve(value.text),
          }),
        );
        return [value];
      });
    }
  }
  return (await Promise.all(closures.map(async fn => fn()))).flat();
}

async function propagate<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>, call: AgenticaCallEvent<Model>, retry: number): Promise<AgenticaExecutePrompt<Model>> {
  if (call.operation.protocol === "http") {
    // ----
    // HTTP PROTOCOL
    // ----
    // NESTED VALIDATOR
    const check: IValidation<unknown> = call.operation.function.validate(
      call.arguments,
    );
    if (
      check.success === false
      && retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)
    ) {
      const trial: AgenticaExecutePrompt<Model> | null = await correct(
        ctx,
        call,
        retry,
        check.errors,
      );
      if (trial !== null) {
        return trial;
      }
    }
    try {
      // CALL HTTP API
      const response: IHttpResponse = await executeHttpOperation(call.operation, call.arguments);
      // CHECK STATUS
      const success: boolean
          = ((response.status === 400
            || response.status === 404
            || response.status === 422)
          && retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)
          && typeof response.body) === false;
        // DISPATCH EVENT
      return (
        (success === false
          ? await correct(ctx, call, retry, response.body)
          : null)
        ?? new AgenticaExecutePrompt({
          operation: call.operation,
          id: call.id,
          arguments: call.arguments,
          value: response,
        })
      );
    }
    catch (error) {
      // DISPATCH ERROR
      return new AgenticaExecutePrompt({
        operation: call.operation,
        id: call.id,
        arguments: call.arguments,
        value: {
          status: 500,
          headers: {},
          body:
              error instanceof Error
                ? {
                    ...error,
                    name: error.name,
                    message: error.message,
                  }
                : error,
        },
      });
    }
  }
  else {
    // ----
    // CLASS FUNCTION
    // ----
    // VALIDATE FIRST
    const check: IValidation<unknown> = call.operation.function.validate(
      call.arguments,
    );
    if (check.success === false) {
      return (
        (retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)
          ? await correct(ctx, call, retry, check.errors)
          : null)
        ?? new AgenticaExecutePrompt({
          id: call.id,
          operation: call.operation,
          arguments: call.arguments,
          value: {
            name: "TypeGuardError",
            message: "Invalid arguments.",
            errors: check.errors,
          },
        })
      );
    }
    // EXECUTE FUNCTION
    try {
      const value = await executeClassOperation(call.operation, call.arguments);
      return new AgenticaExecutePrompt({
        id: call.id,
        operation: call.operation,
        arguments: call.arguments,
        value,
      });
    }
    catch (error) {
      return new AgenticaExecutePrompt({
        id: call.id,
        operation: call.operation,
        arguments: call.arguments,
        value:
            error instanceof Error
              ? {
                  ...error,
                  name: error.name,
                  message: error.message,
                }
              : error,
      });
    }
  }
}

async function executeHttpOperation<Model extends ILlmSchema.Model>(operation: AgenticaOperation.Http<Model>, operationArguments: Record<string, unknown>): Promise<IHttpResponse> {
  const controllerBaseArguments = {
    connection: operation.controller.connection,
    application: operation.controller.application,
    function: operation.function,
  };

  return operation.controller.execute !== undefined
    ? operation.controller.execute({ ...controllerBaseArguments, arguments: operationArguments })
    : HttpLlm.propagate({ ...controllerBaseArguments, input: operationArguments });
}

/**
 * @throws {TypeError}
 */
async function executeClassOperation<Model extends ILlmSchema.Model>(operation: AgenticaOperation.Class<Model>, operationArguments: Record<string, unknown>): Promise<unknown> {
  const execute = operation.controller.execute;
  if (typeof execute === "function") {
    return await execute({
      application: operation.controller.application,
      function: operation.function,
      arguments: operationArguments,
    });
  }

  // As you know, it's very unstable logic.
  // But this is an intended error.
  // There are two types of errors that can occur here.
  // One is a TypeError caused by referencing an undefined value, and the other is a TypeError caused by calling something that isn't a function.
  // These errors are intentional, and any call to this function must be wrapped in a try-catch block.
  // Unless there is an overall structural improvement, this function will remain as-is.
  return ((execute as Record<string, unknown>)[operation.function.name] as (...args: unknown[]) => Promise<unknown>)(operationArguments);
}

async function correct<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>, call: AgenticaCallEvent<Model>, retry: number, error: unknown): Promise<AgenticaExecutePrompt<Model> | null> {
  // ----
  // EXECUTE CHATGPT API
  // ----
  const completionStream = await ctx.request("call", {
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
        // TYPE CORRECTION
        {
          role: "system",
          content:
            ctx.config?.systemPrompt?.execute?.(ctx.histories)
            ?? AgenticaSystemPrompt.EXECUTE,
        },
        {
          role: "assistant",
          tool_calls: [
            {
              type: "function",
              id: call.id,
              function: {
                name: call.operation.name,
                arguments: JSON.stringify(call.arguments),
              },
            } satisfies OpenAI.ChatCompletionMessageToolCall,
          ],
        } satisfies OpenAI.ChatCompletionAssistantMessageParam,
        {
          role: "tool",
          content: typeof error === "string" ? error : JSON.stringify(error),
          tool_call_id: call.id,
        } satisfies OpenAI.ChatCompletionToolMessageParam,
        {
          role: "system",
          content: [
            "You A.I. assistant has composed wrong arguments.",
            "",
            "Correct it at the next function calling.",
          ].join("\n"),
        },
    ],
    // STACK FUNCTIONS
    tools: [
      {
        type: "function",
        function: {
          name: call.operation.name,
          description: call.operation.function.description,
          /**
           * @TODO fix it
           * The property and value have a type mismatch, but it works.
           */
          parameters: (call.operation.function.separated !== undefined
            ? (call.operation.function.separated?.llm
              ?? ({
                $defs: {},
                type: "object",
                properties: {},
                additionalProperties: false,
                required: [],
              } satisfies IChatGptSchema.IParameters))
            : call.operation.function.parameters) as unknown as Record<string, unknown>,
        },
      },
    ],
    tool_choice: "auto",
    parallel_tool_calls: false,
  });

  const chunks = await StreamUtil.readAll(completionStream);
  const completion = ChatGptCompletionMessageUtil.merge(chunks);
  // ----
  // PROCESS COMPLETION
  // ----
  const toolCall: OpenAI.ChatCompletionMessageToolCall | undefined = (
    completion.choices[0]?.message.tool_calls ?? []
  ).find(
    tc =>
      tc.type === "function" && tc.function.name === call.operation.name,
  );
  if (toolCall === undefined) {
    return null;
  }
  return propagate(
    ctx,
    new AgenticaCallEvent({
      id: toolCall.id,
      operation: call.operation,
      arguments: JSON.parse(toolCall.function.arguments) as Record<string, unknown>,
    }),
    retry,
  );
}

function fillHttpArguments<Model extends ILlmSchema.Model>(props: {
  operation: AgenticaOperation<Model>;
  arguments: Record<string, unknown>;
}): void {
  if (props.operation.protocol !== "http") {
    return;
  }
  const route: IHttpMigrateRoute = props.operation.function.route();
  if (
    route.body !== null
    && route.operation().requestBody?.required === true
    && "body" in props.arguments
    && isObject(
      (props.operation.function.parameters as IChatGptSchema.IParameters)
        .$defs,
      (props.operation.function.parameters as IChatGptSchema.IParameters)
        .properties
        .body!,
    )
  ) { props.arguments.body = {}; }
  if (route.query !== null && "query" in props.arguments && props.arguments.query === undefined) {
    props.arguments.query = {};
  }
}

function isObject($defs: Record<string, IChatGptSchema>, schema: IChatGptSchema): boolean {
  return (
    ChatGptTypeChecker.isObject(schema)
    || (ChatGptTypeChecker.isReference(schema)
      && isObject($defs, $defs[schema.$ref.split("/").at(-1)!]!))
    || (ChatGptTypeChecker.isAnyOf(schema)
      && schema.anyOf.every(schema => isObject($defs, schema)))
  );
}

export const ChatGptCallFunctionAgent = {
  execute,
};
