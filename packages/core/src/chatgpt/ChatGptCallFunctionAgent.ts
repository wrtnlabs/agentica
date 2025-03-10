import {
  ChatGptTypeChecker,
  HttpLlm,
  IChatGptSchema,
  IHttpMigrateRoute,
  IHttpResponse,
  ILlmSchema,
} from "@samchon/openapi";
import OpenAI from "openai";
import { IValidation } from "typia";

import { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";
import { AgenticaContext } from "../context/AgenticaContext";
import { AgenticaOperation } from "../context/AgenticaOperation";
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
import { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import { ChatGptCancelFunctionAgent } from "./ChatGptCancelFunctionAgent";
import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptCallFunctionAgent {
  export const execute = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
  ): Promise<AgenticaPrompt<Model>[]> => {
    //----
    // EXECUTE CHATGPT API
    //----
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
            ctx.config?.systemPrompt?.execute?.(ctx.histories) ??
            AgenticaSystemPrompt.EXECUTE,
        },
      ],
      // STACKED FUNCTIONS
      tools: ctx.stack.map(
        (s) =>
          ({
            type: "function",
            function: {
              name: s.operation.name,
              description: s.operation.function.description,
              parameters: (s.operation.function.separated
                ? (s.operation.function.separated.llm ??
                  ({
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

    //----
    // PROCESS COMPLETION
    //----
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
          const operation: AgenticaOperation<Model> | undefined =
            ctx.operations.flat.get(tc.function.name);
          if (operation === undefined) continue;
          closures.push(
            async (): Promise<
              [AgenticaExecutePrompt<Model>, AgenticaCancelPrompt<Model>]
            > => {
              const call: AgenticaCallEvent<Model> = new AgenticaCallEvent({
                id: tc.id,
                operation,
                arguments: JSON.parse(tc.function.arguments),
              });
              if (call.operation.protocol === "http")
                fillHttpArguments({
                  operation: call.operation,
                  arguments: call.arguments,
                });
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
        choice.message.role === "assistant" &&
        !!choice.message.content?.length
      )
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
              join: () => Promise.resolve(value.text),
            }),
          );
          return [value];
        });
    }
    return (await Promise.all(closures.map((fn) => fn()))).flat();
  };

  const propagate = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
    call: AgenticaCallEvent<Model>,
    retry: number,
  ): Promise<AgenticaExecutePrompt<Model>> => {
    if (call.operation.protocol === "http") {
      //----
      // HTTP PROTOCOL
      //----
      // NESTED VALIDATOR
      const check: IValidation<unknown> = call.operation.function.validate(
        call.arguments,
      );
      if (
        check.success === false &&
        retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)
      ) {
        const trial: AgenticaExecutePrompt<Model> | null = await correct(
          ctx,
          call,
          retry,
          check.errors,
        );
        if (trial !== null) return trial;
      }
      try {
        // CALL HTTP API
        const response: IHttpResponse = call.operation.controller.execute
          ? await call.operation.controller.execute({
              connection: call.operation.controller.connection,
              application: call.operation.controller.application,
              function: call.operation.function,
              arguments: call.arguments,
            })
          : await HttpLlm.propagate({
              connection: call.operation.controller.connection,
              application: call.operation.controller.application,
              function: call.operation.function,
              input: call.arguments,
            });
        // CHECK STATUS
        const success: boolean =
          ((response.status === 400 ||
            response.status === 404 ||
            response.status === 422) &&
            retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY) &&
            typeof response.body) === false;
        // DISPATCH EVENT
        return (
          (success === false
            ? await correct(ctx, call, retry, response.body)
            : null) ??
          new AgenticaExecutePrompt({
            operation: call.operation,
            id: call.id,
            arguments: call.arguments,
            value: response,
          })
        );
      } catch (error) {
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
    } else {
      //----
      // CLASS FUNCTION
      //----
      // VALIDATE FIRST
      const check: IValidation<unknown> = call.operation.function.validate(
        call.arguments,
      );
      if (check.success === false)
        return (
          (retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)
            ? await correct(ctx, call, retry, check.errors)
            : null) ??
          new AgenticaExecutePrompt({
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
      // EXECUTE FUNCTION
      try {
        const value: any =
          typeof call.operation.controller.execute === "function"
            ? await call.operation.controller.execute({
                application: call.operation.controller.application,
                function: call.operation.function,
                arguments: call.arguments,
              })
            : await (call.operation.controller.execute as any)[
                call.operation.function.name
              ](call.arguments);
        return new AgenticaExecutePrompt({
          id: call.id,
          operation: call.operation,
          arguments: call.arguments,
          value,
        });
      } catch (error) {
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
  };

  const correct = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
    call: AgenticaCallEvent<Model>,
    retry: number,
    error: unknown,
  ): Promise<AgenticaExecutePrompt<Model> | null> => {
    //----
    // EXECUTE CHATGPT API
    //----
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
            ctx.config?.systemPrompt?.execute?.(ctx.histories) ??
            AgenticaSystemPrompt.EXECUTE,
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
            parameters: (call.operation.function.separated
              ? (call.operation.function.separated?.llm ??
                ({
                  $defs: {},
                  type: "object",
                  properties: {},
                  additionalProperties: false,
                  required: [],
                } satisfies IChatGptSchema.IParameters))
              : call.operation.function.parameters) as any,
          },
        },
      ],
      tool_choice: "auto",
      parallel_tool_calls: false,
    });

    const chunks = await StreamUtil.readAll(completionStream);
    const completion = ChatGptCompletionMessageUtil.merge(chunks);
    //----
    // PROCESS COMPLETION
    //----
    const toolCall: OpenAI.ChatCompletionMessageToolCall | undefined = (
      completion.choices[0]?.message.tool_calls ?? []
    ).find(
      (tc) =>
        tc.type === "function" && tc.function.name === call.operation.name,
    );
    if (toolCall === undefined) return null;
    return propagate(
      ctx,
      new AgenticaCallEvent({
        id: toolCall.id,
        operation: call.operation,
        arguments: JSON.parse(toolCall.function.arguments),
      }),
      retry,
    );
  };

  const fillHttpArguments = <Model extends ILlmSchema.Model>(props: {
    operation: AgenticaOperation<Model>;
    arguments: object;
  }): void => {
    if (props.operation.protocol !== "http") return;
    const route: IHttpMigrateRoute = props.operation.function.route();
    if (
      route.body &&
      route.operation().requestBody?.required === true &&
      (props.arguments as any).body === undefined &&
      isObject(
        (props.operation.function.parameters as IChatGptSchema.IParameters)
          .$defs,
        (props.operation.function.parameters as IChatGptSchema.IParameters)
          .properties.body!,
      )
    )
      (props.arguments as any).body = {};
    if (route.query && (props.arguments as any).query === undefined)
      (props.arguments as any).query = {};
  };

  const isObject = (
    $defs: Record<string, IChatGptSchema>,
    schema: IChatGptSchema,
  ): boolean => {
    return (
      ChatGptTypeChecker.isObject(schema) ||
      (ChatGptTypeChecker.isReference(schema) &&
        isObject($defs, $defs[schema.$ref.split("/").at(-1)!]!)) ||
      (ChatGptTypeChecker.isAnyOf(schema) &&
        schema.anyOf.every((schema) => isObject($defs, schema)))
    );
  };
}
