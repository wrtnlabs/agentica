import type { AgenticaContext, AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { functional } from "@wrtnlabs/connector-hive-api";

import type { IAgenticaPgVectorSelectorBootProps } from "./AgenticaPgVectorSelectorBootProps";

import { embedContext, useEmbeddedContext } from "./embed";
import { extractQuery } from "./extract_query";
import { selectFunction } from "./select";
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

    const queries = await extractQuery(ctx);

    const toolList = await Promise.all(
      queries.map(async query => retry(async () =>
        functional.connector_retrievals.createRetrievalRequest(connection, {
          query,
          limit: 10,
          filter,
        }),
      )),
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
