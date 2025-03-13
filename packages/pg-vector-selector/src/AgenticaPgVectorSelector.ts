import {
  AgenticaContext,
  AgenticaOperation,
  AgenticaOperationCollection,
  AgenticaPrompt,
  AgenticaTextPrompt,
} from "@agentica/core";
import { ChatGptCompletionMessageUtil } from "@agentica/core/src/chatgpt/ChatGptCompletionMessageUtil";
import { ChatGptHistoryDecoder } from "@agentica/core/src/chatgpt/ChatGptHistoryDecoder";
import { StreamUtil } from "@agentica/core/src/internal/StreamUtil";
import { ILlmSchema } from "@samchon/openapi";
import { HttpError, functional } from "@wrtnlabs/connector-hive-api";
import { IApplicationConnectorRetrieval } from "@wrtnlabs/connector-hive-api/lib/structures/connector/IApplicationConnectorRetrieval";

import { IAgenticaPgVectorSelectorBootProps } from "./AgenticaPgVectorSelectorBootProps";

const useEmbeddedContext = <SchemaModel extends ILlmSchema.Model>() => {
  const set = new Map<
    AgenticaOperationCollection<SchemaModel>,
    IApplicationConnectorRetrieval.IFilter
  >();
  return [
    (ctx: AgenticaContext<SchemaModel>) => set.has(ctx.operations),
    (
      ctx: AgenticaContext<SchemaModel>,
      filter: IApplicationConnectorRetrieval.IFilter,
    ) => {
      set.set(ctx.operations, filter);
    },
    (ctx: AgenticaContext<SchemaModel>) => set.get(ctx.operations),
  ] as const;
};

const getRetry = (count: number) => {
  if (count < 1) {
    throw new Error("count should be greater than 0");
  }

  return async <T>(fn: () => Promise<T>) => {
    let lastError: Error | null = null;

    for (let i = 0; i < count; i++) {
      try {
        return await fn();
      } catch (e: unknown) {
        lastError = e as Error;
        if (i === count - 1) throw e;
      }
    }

    if (lastError) throw lastError;
    throw new Error("unreachable code");
  };
};

const groupByArray = <T>(array: T[], count: number): T[][] => {
  const grouped = [];
  for (let i = 0; i < array.length; i += count) {
    grouped.push(array.slice(i, i + count));
  }
  return grouped;
};

const retry = getRetry(3);

export namespace AgenticaPgVectorSelector {
  export const boot = <SchemaModel extends ILlmSchema.Model>(
    props: IAgenticaPgVectorSelectorBootProps,
  ) => {
    const [isEmbeddedContext, setEmbeddedContext, getFilterFromContext] =
      useEmbeddedContext<SchemaModel>();
    const connection = props.connectorHiveConnection;
    const embedOperation = async (
      controllerName: string,
      opList: AgenticaOperation<SchemaModel>[],
    ) => {
      const application = await retry(() =>
        functional.applications.create(connection, {
          name: controllerName,
          description: undefined,
        }),
      ).catch(async (e) => {
        if (!(e instanceof HttpError)) {
          throw e;
        }
        if (e.status !== 409) throw e;

        return await retry(() =>
          functional.applications.by_names.getByName(
            connection,
            controllerName,
          ),
        );
      });

      const version = await retry(() =>
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
          cur.map((v) =>
            retry(() =>
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

        tools: [
          {
            type: "function",
            function: {
              name: "extract_search_query",
              description: "extract search query from user message",
              parameters: {
                type: "object",
                properties: {
                  query: {
                    type: "string",
                    description: "the search query",
                  },
                },
                required: ["query"],
              },
            },
          },
        ],
      });

      const chunks = await StreamUtil.readAll(completionStream);
      const completion = ChatGptCompletionMessageUtil.merge(chunks);

      const resultList = await Promise.all(
        completion.choices[0]?.message.tool_calls?.flatMap((v) => {
          const arg = JSON.parse(v.function.arguments) as { query?: string };
          const query = arg.query;
          if (typeof query !== "string") {
            return [];
          }
          return retry(() =>
            functional.connector_retrievals.createRetrievalRequest(connection, {
              query,
              limit: 10,
              filter,
            }),
          );
        }) ?? [],
      ).then((res) =>
        res.flatMap((output) =>
          output.map((v) => ({
            name: v.name,
            description: v.description,
          })),
        ),
      );

      const text: AgenticaTextPrompt = new AgenticaTextPrompt({
        role: "assistant",
        text: `I will use next tools because it is semantic search result: ${JSON.stringify(
          resultList,
        )}`,
      });
      return [text];
    };

    return selectorExecute;
  };
}
