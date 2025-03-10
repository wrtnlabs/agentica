import { ILlmApplication, ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";
import typia, { IValidation } from "typia";
import { v4 } from "uuid";

import { AgenticaCancelPrompt } from "../context/AgenticaCancelPrompt";
import { AgenticaContext } from "../context/AgenticaContext";
import { AgenticaOperation } from "../context/AgenticaOperation";
import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { __IChatCancelFunctionsApplication } from "../context/internal/__IChatCancelFunctionsApplication";
import { __IChatFunctionReference } from "../context/internal/__IChatFunctionReference";
import { AgenticaCancelEvent } from "../events/AgenticaCancelEvent";
import { AgenticaEvent } from "../events/AgenticaEvent";
import { AgenticaConstant } from "../internal/AgenticaConstant";
import { AgenticaDefaultPrompt } from "../internal/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "../internal/AgenticaSystemPrompt";
import { StreamUtil } from "../internal/StreamUtil";
import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "./ChatGptHistoryDecoder";

export namespace ChatGptCancelFunctionAgent {
  export const execute = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
  ): Promise<AgenticaCancelPrompt<Model>[]> => {
    if (ctx.operations.divided === undefined)
      return step(ctx, ctx.operations.array, 0);

    const stacks: AgenticaOperationSelection<Model>[][] =
      ctx.operations.divided.map(() => []);
    const events: AgenticaEvent<Model>[] = [];
    const prompts: AgenticaCancelPrompt<Model>[][] = await Promise.all(
      ctx.operations.divided.map((operations, i) =>
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
    if (stacks.every((s) => s.length === 0)) return prompts[0]!;
    // ELITICISM
    else if ((ctx.config?.eliticism ?? AgenticaConstant.ELITICISM) === true)
      return step(
        ctx,
        stacks
          .flat()
          .map(
            (s) =>
              ctx.operations.group
                .get(s.operation.controller.name)!
                .get(s.operation.function.name)!,
          ),
        0,
      );

    // RE-COLLECT SELECT FUNCTION EVENTS
    const collection: AgenticaCancelPrompt<Model> = new AgenticaCancelPrompt({
      id: v4(),
      selections: [],
    });
    for (const e of events)
      if (e.type === "select") {
        collection.selections.push(e.selection);
        await cancelFunction(ctx, {
          name: e.selection.operation.name,
          reason: e.selection.reason,
        });
      }
    return [collection];
  };

  export const cancelFunction = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
    reference: __IChatFunctionReference,
  ): Promise<AgenticaOperationSelection<Model> | null> => {
    const index: number = ctx.stack.findIndex(
      (item) => item.operation.name === reference.name,
    );
    if (index === -1) return null;

    const item: AgenticaOperationSelection<Model> = ctx.stack[index]!;
    ctx.stack.splice(index, 1);
    await ctx.dispatch(
      new AgenticaCancelEvent({
        selection: new AgenticaOperationSelection({
          operation: item.operation,
          reason: reference.reason,
        }),
      }),
    );
    return item;
  };

  const step = async <Model extends ILlmSchema.Model>(
    ctx: AgenticaContext<Model>,
    operations: AgenticaOperation<Model>[],
    retry: number,
    failures?: IFailure[],
  ): Promise<AgenticaCancelPrompt<Model>[]> => {
    //----
    // EXECUTE CHATGPT API
    //----
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
            operations.map((op) => ({
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
            ctx.config?.systemPrompt?.cancel?.(ctx.histories) ??
            AgenticaSystemPrompt.CANCEL,
        },
        // TYPE CORRECTIONS
        ...emendMessages(failures ?? []),
      ],
      // STACK FUNCTIONS
      tools: CONTAINER.functions.map(
        (func) =>
          ({
            type: "function",
            function: {
              name: func.name,
              description: func.description,
              parameters: func.parameters as any,
            },
          }) satisfies OpenAI.ChatCompletionTool,
      ),
      tool_choice: "auto",
      parallel_tool_calls: true,
    });

    const chunks = await StreamUtil.readAll(completionStream);
    const completion = ChatGptCompletionMessageUtil.merge(chunks);

    //----
    // VALIDATION
    //----
    if (retry++ < (ctx.config?.retry ?? AgenticaConstant.RETRY)) {
      const failures: IFailure[] = [];
      for (const choice of completion.choices)
        for (const tc of choice.message.tool_calls ?? []) {
          if (tc.function.name !== "cancelFunctions") continue;
          const input: object = JSON.parse(tc.function.arguments);
          const validation: IValidation<__IChatFunctionReference.IProps> =
            typia.validate<__IChatFunctionReference.IProps>(input);
          if (validation.success === false)
            failures.push({
              id: tc.id,
              name: tc.function.name,
              validation,
            });
        }
      if (failures.length > 0) return step(ctx, operations, retry, failures);
    }

    //----
    // PROCESS COMPLETION
    //----
    const prompts: AgenticaCancelPrompt<Model>[] = [];
    for (const choice of completion.choices) {
      // TOOL CALLING HANDLER
      if (choice.message.tool_calls)
        for (const tc of choice.message.tool_calls) {
          if (tc.type !== "function") continue;
          const input: __IChatFunctionReference.IProps = JSON.parse(
            tc.function.arguments,
          );
          if (typia.is(input) === false) continue;
          else if (tc.function.name === "cancelFunctions") {
            const collection: AgenticaCancelPrompt<Model> =
              new AgenticaCancelPrompt({
                id: tc.id,
                selections: [],
              });
            for (const reference of input.functions) {
              const operation = await cancelFunction(ctx, reference);
              if (operation !== null) collection.selections.push(operation);
            }
            if (collection.selections.length !== 0) prompts.push(collection);
          }
        }
    }
    return prompts;
  };

  const emendMessages = (
    failures: IFailure[],
  ): OpenAI.ChatCompletionMessageParam[] =>
    failures
      .map((f) => [
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

const CONTAINER: ILlmApplication<"chatgpt"> = typia.llm.application<
  __IChatCancelFunctionsApplication,
  "chatgpt"
>();

interface IFailure {
  id: string;
  name: string;
  validation: IValidation.IFailure;
}
