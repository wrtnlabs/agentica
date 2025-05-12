import type { AgenticaContext, AgenticaOperationSelection, AgenticaSelectHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { factory, utils } from "@agentica/core";
import { AgenticaDefaultPrompt } from "@agentica/core/src/constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "@agentica/core/src/constants/AgenticaSystemPrompt";

import { Tools } from "./tools";

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
        content: ctx.prompt.contents.map(factory.decodeUserMessageContent),
      },
      {
        role: "system",
        content: `${ctx.config?.systemPrompt?.select?.(ctx.histories)
        ?? AgenticaSystemPrompt.SELECT}
          
        
        When selecting functions, consider what the user can call from their perspective, and choose all the functions necessary to accomplish the task.
        Select them in a logical sequence, taking into account the relationships between each function.
        `,
      },
      ...emendMessages(prevFailures),
    ],
    tool_choice: {
      type: "function",
      function: {
        name: "select_functions",
      },
    },
    parallel_tool_calls: false,
    tools: [Tools.select_functions],
  })
    .then(async v => utils.StreamUtil.readAll(v))
    .then(utils.ChatGptCompletionMessageUtil.merge);

  const toolCalls = selectCompletion.choices
    .filter(v => v.message.tool_calls != null);

  if (toolCalls.length === 0) {
    return selectCompletion.choices.flatMap((v) => {
      if (v.message.content != null && v.message.content !== "") {
        return [
          factory.createAssistantMessageHistory({ text: v.message.content }),
        ];
      }
      return [];
    });
  }

  const failures = toolCalls.reduce<IFailure[]>((acc, cur) => {
    cur.message.tool_calls?.forEach((tc) => {
      const errors: string[] = [];
      const arg = JSON.parse(tc.function.arguments) as Partial<{ reason: string; function_name: string }>[];
      if (!Array.isArray(arg)) {
        errors.push(JSON.stringify({
          path: "$input",
          expected: "array",
          value: arg,
        }));
        return;
      }
      arg.forEach((v, idx) => {
        if (v.reason == null || typeof v.reason !== "string") {
          errors.push(JSON.stringify({
            path: `$$input[${idx}].reason`,
            expected: "string",
            value: v.reason,
          }));
        }

        if (v.function_name == null || typeof v.function_name !== "string") {
          errors.push(JSON.stringify({
            path: `$$input[${idx}].function_name`,
            expected: "string",
            value: v.function_name,
          }));
        }
      });

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
        function_list: {
          reason: string;
          function_name: string;
        }[];
      };
      arg.function_list.forEach((v) => {
        const operation = ctx.operations.flat.get(v.function_name);

        if (operation === undefined) {
          return;
        }
        const selection: AgenticaOperationSelection<SchemaModel>
          = factory.createOperationSelection({
            reason: v.reason,
            operation,
          });
        ctx.stack.push(selection);
        ctx.dispatch(factory.createSelectEvent({ selection })).catch(() => {});
        collection.selections.push(selection);
      });
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
