import type { AgenticaContext, AgenticaHistory, AgenticaOperation, AgenticaOperationSelection, AgenticaSelectHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrieval";

import { factory, utils } from "@agentica/core";
import { AgenticaDefaultPrompt } from "@agentica/core/src/constants/AgenticaDefaultPrompt";
import { AgenticaSystemPrompt } from "@agentica/core/src/constants/AgenticaSystemPrompt";
import { functional, HttpError } from "@wrtnlabs/connector-hive-api";

import type { IAgenticaPgVectorSelectorBootProps } from "./AgenticaPgVectorSelectorBootProps";

import { Tools } from "./Tools";
import { getRetry, groupByArray } from "./utils";

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
    ): Promise<AgenticaHistory<SchemaModel>[]> => {
      if (!isEmbeddedContext(ctx)) {
        await embedContext(ctx);
      }

      const prompts: AgenticaHistory<SchemaModel>[] = [];

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
            .map(factory.decodeHistory<SchemaModel>)
            .flat(),
          {
            role: "user",
            content: ctx.prompt.text,
          },
        ],
        tool_choice: "required",

        tools: [Tools.extract_query],
      });

      const chunks = await utils.StreamUtil.readAll(completionStream);
      const completion = utils.ChatGptCompletionMessageUtil.merge(chunks);

      const toolList = await Promise.all(
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
        ).map((v) => {
          const op = ctx.operations.flat.get(v.name);
          if (op === undefined || op.protocol !== "http") {
            return v;
          }

          return {
            ...v,
            method: op.function.method,
            path: op.function.path,
            tags: op.function.tags,
          };
        }),
      );

      // console.log("Tool List: ", toolList.map(v => v.name), "Total: ", toolList.length);
      if (toolList.length === 0) {
        return [];
      }

      const selectCompletion = await ctx
        .request("select", {
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
            ...ctx.histories
              .map(factory.decodeHistory<SchemaModel>)
              .flat(),
            {
              role: "user",
              content: ctx.prompt.text,
            },

            {
              role: "system",
              content: ctx.config?.systemPrompt?.select?.(ctx.histories)
                ?? AgenticaSystemPrompt.SELECT,
            },
          ],
          tool_choice: "required",
          tools: [Tools.select_function],
        })
        .then(async v => utils.StreamUtil.readAll(v))
        .then(utils.ChatGptCompletionMessageUtil.merge);
      console.log(selectCompletion.choices);
      selectCompletion.choices
        .filter(v => v.message.tool_calls != null)
        .forEach((v) => {
          v.message
            .tool_calls!.filter(tc => tc.function.name === "execute_function").forEach((tc) => {
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
              // @todo core has to export event/operation factories
              const selection: AgenticaOperationSelection<SchemaModel>
                  = factory.createOperationSelection({
                    reason: fn.reason,
                    operation,
                  });
              ctx.stack.push(selection);
              ctx.dispatch(factory.createSelectEvent({ selection })).catch(() => {});
              collection.selections.push(selection);
            });

            if (collection.selections.length !== 0) {
              prompts.push(collection);
            }
          });
        });

      if (prompts.length === 0) {
        selectCompletion.choices.forEach((v) => {
          prompts.push(factory.createTextHistory({ role: "assistant", text: v.message.content ?? "" }));
        });
      }

      console.log("Prompts: ", prompts);

      return prompts;
    };

    return selectorExecute;
  }
}
