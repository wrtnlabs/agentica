import type {
  AgenticaContext,
  AgenticaOperation,
  AgenticaPrompt,
} from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrieval";
import type { IAgenticaPgVectorSelectorBootProps } from "./AgenticaPgVectorSelectorBootProps";
import {
  AgenticaOperationSelection,
  AgenticaSelectEvent,
  AgenticaSelectPrompt,
} from "@agentica/core";
import { ChatGptCompletionMessageUtil } from "@agentica/core/src/chatgpt/ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "@agentica/core/src/chatgpt/ChatGptHistoryDecoder";
import { StreamUtil } from "@agentica/core/src/internal/StreamUtil";

import { functional, HttpError } from "@wrtnlabs/connector-hive-api";
import { Tools } from "./Tools";

function useEmbeddedContext<SchemaModel extends ILlmSchema.Model>() {
  const set = new Map<string, IApplicationConnectorRetrieval.IFilter>();
  return [
    (ctx: AgenticaContext<SchemaModel>) =>
      set.has(JSON.stringify(ctx.operations.array)),
    (
      ctx: AgenticaContext<SchemaModel>,
      filter: IApplicationConnectorRetrieval.IFilter,
    ) => {
      set.set(JSON.stringify(ctx.operations.array), filter);
    },
    (ctx: AgenticaContext<SchemaModel>) =>
      set.get(JSON.stringify(ctx.operations.array)),
  ] as const;
}

function getRetry(count: number) {
  if (count < 1) {
    throw new Error("count should be greater than 0");
  }

  return async <T>(fn: () => Promise<T>) => {
    let lastError: Error | null = null;

    for (let i = 0; i < count; i++) {
      try {
        return await fn();
      }
      catch (e: unknown) {
        lastError = e as Error;
        if (i === count - 1) {
          throw e;
        }
      }
    }

    if (lastError != null) {
      throw lastError;
    }
    throw new Error("unreachable code");
  };
}

function groupByArray<T>(array: T[], count: number): T[][] {
  const grouped = [];
  for (let i = 0; i < array.length; i += count) {
    grouped.push(array.slice(i, i + count));
  }
  return grouped;
}

const retry = getRetry(3);

export namespace AgenticaPgVectorSelector {
  export function boot<SchemaModel extends ILlmSchema.Model>(props: IAgenticaPgVectorSelectorBootProps) {
    const [isEmbeddedContext, setEmbeddedContext, getFilterFromContext]
      = useEmbeddedContext<SchemaModel>();
    const connection = props.connectorHiveConnection;
    const embedOperation = async (
      controllerName: string,
      opList: AgenticaOperation<SchemaModel>[],
    ) => {
      const application = await retry(async () =>
        functional.applications.create(connection, {
          name: controllerName,
          description: undefined,
        }),
      ).catch(async (e) => {
        if (!(e instanceof HttpError)) {
          throw e;
        }
        if (e.status !== 409) {
          throw e;
        }

        return retry(async () =>
          functional.applications.by_names.getByName(
            connection,
            controllerName,
          ),
        );
      });

      const version = await retry(async () =>
        functional.applications.by_ids.versions.create(
          connection,
          application.id,
          {},
        ),
      );

      // concurrency request count
      await groupByArray(opList, 10).reduce(async (accPromise, cur) => {
        await accPromise;
        await Promise.all(
          cur.map(async v =>
            retry(async () =>
              functional.application_versions.by_ids.connectors.create(
                connection,
                version.id,
                { name: v.name, description: v.function.description ?? "" },
              ),
            ),
          ),
        );
        return Promise.resolve();
      }, Promise.resolve());

      return { version, applicationId: application.id };
    };

    const embedContext = async (ctx: AgenticaContext<SchemaModel>) => {
      const filter = await Promise.all(
        Array.from(ctx.operations.group.entries()).map(
          async ([key, value]: [
            string,
            Map<string, AgenticaOperation<SchemaModel>>,
          ]) => {
            const result = await embedOperation(
              key,
              Array.from(value.values()),
            );

            return {
              id: result.applicationId,
              version: result.version.version,
              type: "byId",
            } satisfies IApplicationConnectorRetrieval.IFilterApplicationById;
          },
        ),
      );

      setEmbeddedContext(ctx, {
        applications: filter,
      });
    };

    const selectorExecute = async (
      ctx: AgenticaContext<SchemaModel>,
    ): Promise<AgenticaPrompt<SchemaModel>[]> => {
      if (!isEmbeddedContext(ctx)) {
        await embedContext(ctx);
      }

      const prompts: AgenticaPrompt<SchemaModel>[] = [];

      const filter = getFilterFromContext(ctx);

      const completionStream = await ctx.request("select", {
        messages: [
          {
            role: "developer",
            content: [
              "you are a function searcher, you will extract search query from user message",
              "the query like vector search query and query result is function name",
              "so the extracted query must be for function search",
            ].join("\n"),
          },
          ...ctx.histories
            .map(ChatGptHistoryDecoder.decode<SchemaModel>)
            .flat(),
          {
            role: "user",
            content: ctx.prompt.text,
          },
        ],
        tool_choice: "required",

        tools: [Tools.extract_query],
      });

      const chunks = await StreamUtil.readAll(completionStream);
      const completion = ChatGptCompletionMessageUtil.merge(chunks);

      const resultList = await Promise.all(
        completion.choices[0]?.message.tool_calls?.flatMap(async (v) => {
          const arg = JSON.parse(v.function.arguments) as { query?: string };
          const query = arg.query;
          if (typeof query !== "string") {
            return [];
          }
          return retry(async () =>
            functional.connector_retrievals.createRetrievalRequest(connection, {
              query,
              limit: 10,
              filter,
            }),
          );
        }) ?? [],
      ).then(res =>
        res.flatMap(output =>
          output.map(v => ({
            name: v.name,
            description: v.description,
          })),
        ),
      );

      const selectCompletion = await ctx
        .request("select", {
          messages: [
            {
              role: "developer",
              content: [
                props.experimental?.select_prompt
                ?? "You are an AI assistant that selects and executes the most appropriate function(s) based on the current context, running the functions required by the context in the correct order. First, analyze the user's input or situation and provide a brief reasoning for why you chose the function(s) (one or more). Then, execute the selected function(s). If multiple functions are chosen, the order of execution follows the function call sequence, and the result may vary depending on this order. Return the results directly after execution. If clarification is needed, ask the user a concise question.",
                `<FUNCTION_LIST>${JSON.stringify(resultList)}</FUNCTION_LIST>`,
              ].join("\n"),
            },
            ...ctx.histories
              .map(ChatGptHistoryDecoder.decode<SchemaModel>)
              .flat(),
            {
              role: "user",
              content: ctx.prompt.text,
            },
          ],
          tool_choice: "required",
          tools: [Tools.execute_function],
        })
        .then(async v => StreamUtil.readAll(v))
        .then(ChatGptCompletionMessageUtil.merge);

      selectCompletion.choices
        .filter(v => v.message.tool_calls != null && v.message.tool_calls.length > 0)
        .forEach((v) => {
          v.message
            .tool_calls!.filter(tc => tc.function.name === "execute_function").forEach((tc) => {
            const collection = new AgenticaSelectPrompt<SchemaModel>({
              id: tc.id,
              selections: [],
            });
            const arg = JSON.parse(tc.function.arguments) as {
              function_name_list: {
                reason: string;
                function_name: string;
              }[];
            };

            arg.function_name_list.forEach((fn) => {
              const operation = ctx.operations.flat.get(fn.function_name);
              if (operation === undefined) {
                return;
              }
              const selection: AgenticaOperationSelection<SchemaModel>
                  = new AgenticaOperationSelection({
                    reason: fn.reason,
                    operation,
                  });
              ctx.stack.push(selection);
              void ctx.dispatch(new AgenticaSelectEvent({ selection }));
              collection.selections.push(selection);
            });

            if (collection.selections.length !== 0) {
              prompts.push(collection);
            }
          });
        });

      return prompts;
    };

    return selectorExecute;
  }
}
