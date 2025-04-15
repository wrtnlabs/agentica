import type { AgenticaContext, AgenticaOperationSelection, AgenticaSelectHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { factory, utils } from "@agentica/core";
import { AgenticaDefaultPrompt } from "@agentica/core/src/constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "@agentica/core/src/constants/AgenticaSystemPrompt";

import { Tools } from "./Tools";

interface IFailure {
  id: string;
  name: string;
  validation: {
    data: string;
    errors: string[];
  };
}

export async function selectFunction<SchemaModel extends ILlmSchema.Model>(props: {
  ctx: AgenticaContext<SchemaModel>;
  toolList: object[];
  prevFailures?: IFailure[];
  restRetry?: number;
}) {
  const { ctx, toolList, prevFailures = [], restRetry = 5 } = props;
  const selectCompletion = await ctx.request("select", {
    messages: [
      {
        role: "system",
        content: AgenticaDefaultPrompt.write(ctx.config),
      },
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
        content: JSON.stringify(toolList),
      },
      ...ctx.histories.flatMap(factory.decodeHistory<SchemaModel>),
      {
        role: "user",
        content: ctx.prompt.text,
      },
      {
        role: "system",
        content: ctx.config?.systemPrompt?.select?.(ctx.histories)
          ?? AgenticaSystemPrompt.SELECT,
      },
      ...emendMessages(prevFailures),
    ],
    tool_choice: "required",
    tools: [Tools.select_function],
  })
    .then(async v => utils.StreamUtil.readAll(v))
    .then(utils.ChatGptCompletionMessageUtil.merge);

  const toolCalls = selectCompletion.choices
    .filter(v => v.message.tool_calls != null);

  if (toolCalls.length === 0) {
    return selectCompletion.choices.flatMap((v) => {
      if (v.message.content != null && v.message.content !== "") {
        return [factory.createTextHistory({ role: "assistant", text: v.message.content })];
      }
      return [];
    });
  }

  const failures = toolCalls.reduce<IFailure[]>((acc, cur) => {
    cur.message.tool_calls?.forEach((tc) => {
      const errors: string[] = [];

      if (tc.function.name !== "select_function") {
        errors.push(`We have only \`select_function\` function, but you called \`${tc.function.name}\`, please use \`select_function\``);
      }

      const arg = JSON.parse(tc.function.arguments) as Partial<{ reason: string; function_name: string }>;
      if (arg.reason == null || typeof arg.reason !== "string") {
        errors.push(JSON.stringify({
          path: "$input.reason",
          expected: "string",
          value: arg.reason,
        }));
      }

      if (arg.function_name == null || typeof arg.function_name !== "string") {
        errors.push(JSON.stringify({
          path: "$input.function_name",
          expected: "string",
          value: arg.function_name,
        }));
      }

      if (errors.length !== 0) {
        acc.push({
          id: tc.id,
          name: tc.function.name,
          validation: { data: tc.function.arguments, errors },
        });
      }
    });
    return acc;
  }, []);

  if (failures.length !== 0) {
    const feedback = [...prevFailures, ...failures];
    if (restRetry === 0) {
      throw new Error(`Failed to select function after ${restRetry} retries\n${JSON.stringify(feedback)}`);
    }
    return selectFunction({
      ctx,
      toolList,
      prevFailures: feedback,
      restRetry: restRetry - 1,
    });
  }

  const prompts: AgenticaSelectHistory<SchemaModel>[] = [];
  toolCalls.forEach((v) => {
    v.message.tool_calls!.forEach((tc) => {
      const collection: AgenticaSelectHistory<SchemaModel> = {
        type: "select",
        id: tc.id,
        selections: [],
        toJSON: () => ({
          type: "select",
          id: tc.id,
          selections: collection.selections.map(s => s.toJSON()),
        }),
      };
      const arg = JSON.parse(tc.function.arguments) as {
        reason: string;
        function_name: string;
      };

      const operation = ctx.operations.flat.get(arg.function_name);
      if (operation === undefined) {
        return;
      }
      // @todo core has to export event/operation factories
      const selection: AgenticaOperationSelection<SchemaModel>
        = factory.createOperationSelection({
          reason: arg.reason,
          operation,
        });
      ctx.stack.push(selection);
      ctx.dispatch(factory.createSelectEvent({ selection })).catch(() => {});
      collection.selections.push(selection);
      prompts.push(collection);
    });
  });

  return prompts;
}

function emendMessages<SchemaModel extends ILlmSchema.Model>(failures: IFailure[]): ReturnType<typeof factory.decodeHistory<SchemaModel>> {
  return failures
    .flatMap(f => [
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
      },
      {
        role: "tool",
        content: JSON.stringify(f.validation.errors),
        tool_call_id: f.id,
      },
      {
        role: "system",
        content: [
          "You A.I. assistant has composed wrong typed arguments.",
          "",
          "Correct it at the next function calling.",
        ].join("\n"),
      },
    ]) satisfies ReturnType<typeof factory.decodeHistory<SchemaModel>>;
}
