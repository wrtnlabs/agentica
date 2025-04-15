import type { AgenticaContext, AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { factory, utils } from "@agentica/core";
import { functional } from "@wrtnlabs/connector-hive-api";

import type { IAgenticaPgVectorSelectorBootProps } from "./AgenticaPgVectorSelectorBootProps";

import { embedContext, useEmbeddedContext } from "./embed";
import { selectFunction } from "./select";
import { Tools } from "./Tools";
import { getRetry, uniqBy } from "./utils";

const retry = getRetry(3);

export function BootAgenticaPgVectorSelector<SchemaModel extends ILlmSchema.Model>(props: IAgenticaPgVectorSelectorBootProps) {
  const [isEmbeddedContext, setEmbeddedContext, getFilterFromContext]
    = useEmbeddedContext<SchemaModel>();
  const connection = props.connectorHiveConnection;

  const selectorExecute = async (
    ctx: AgenticaContext<SchemaModel>,
  ): Promise<AgenticaHistory<SchemaModel>[]> => {
    if (!isEmbeddedContext(ctx)) {
      await embedContext(connection)(ctx, setEmbeddedContext);
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
    ).then(arr => uniqBy(arr, v => v.name));

    if (toolList.length === 0) {
      return [];
    }

    const prompts = await selectFunction({ ctx, toolList });

    return prompts;
  };

  return selectorExecute;
}

/**
 * @deprecated Use `BootAgenticaPgVectorSelector` instead.
 */
export const AgenticaPgVectorSelector = {
  boot: BootAgenticaPgVectorSelector,
};
