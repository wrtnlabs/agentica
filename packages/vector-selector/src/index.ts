import type { AgenticaContext, AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { extractQuery } from "./extract_query";
import { selectFunction } from "./select";
import { uniqBy } from "./utils";

export interface IAgenticaVectorSelectorBootProps<SchemaModel extends ILlmSchema.Model> {
  strategy: IAgenticaVectorSelectorStrategy<SchemaModel>;
}
export interface IAgenticaVectorSelectorStrategy<SchemaModel extends ILlmSchema.Model> {
  searchTool: (ctx: AgenticaContext<SchemaModel>, query: string) => Promise<{
    name: string;
    description: string | undefined;
  }[]>;
  embedContext: (
    props: {
      ctx: AgenticaContext<SchemaModel>;
      setEmbedded: () => void;
    }
  ) => Promise<void>;
}

export function BootAgenticaVectorSelector<SchemaModel extends ILlmSchema.Model>(props: IAgenticaVectorSelectorBootProps<SchemaModel>) {
  const { isEmbedded, setEmbedded } = useEmbeddedContext<SchemaModel>();
  const { searchTool, embedContext } = props.strategy;
  const selectorExecute = async (
    ctx: AgenticaContext<SchemaModel>,
  ): Promise<AgenticaHistory<SchemaModel>[]> => {
    if (!isEmbedded(ctx)) {
      await embedContext({ ctx, setEmbedded: () => setEmbedded(ctx) });
    }

    const queries = await extractQuery(ctx);
    const toolList = await Promise.all(
      queries.map(async query => searchTool(ctx, query)),
    ).then(res => res.flat().map((v) => {
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
    })).then(arr => uniqBy(arr, v => v.name));

    if (toolList.length === 0) {
      return [];
    }

    const prompts = await selectFunction({ ctx, toolList });
    return prompts;
  };

  return selectorExecute;
}

export function useEmbeddedContext<SchemaModel extends ILlmSchema.Model>() {
  const set = new Set<string>();
  return {
    isEmbedded: (ctx: AgenticaContext<SchemaModel>) =>
      set.has(JSON.stringify(ctx.operations.array)),
    setEmbedded: (ctx: AgenticaContext<SchemaModel>) => {
      set.add(JSON.stringify(ctx.operations.array));
    },
  } as const;
}
