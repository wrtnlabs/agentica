import type { AgenticaContext } from "@agentica/core";

import { extractQuery } from "./extract_query";
import { selectFunction } from "./select";
import { uniqBy } from "./utils";

export interface IAgenticaVectorSelectorBootProps {
  strategy: IAgenticaVectorSelectorStrategy;
}
export interface IAgenticaVectorSelectorStrategy {
  searchTool: (ctx: AgenticaContext, query: string) => Promise<{
    name: string;
    description: string | undefined;
  }[]>;
  embedContext: (
    props: {
      ctx: AgenticaContext;
      setEmbedded: () => void;
    }
  ) => Promise<void>;
}

export function BootAgenticaVectorSelector(props: IAgenticaVectorSelectorBootProps) {
  const { isEmbedded, setEmbedded } = useEmbeddedContext();
  const { searchTool, embedContext } = props.strategy;
  const selectorExecute = async (
    ctx: AgenticaContext,
  ): Promise<void> => {
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
      return;
    }
    await selectFunction({ ctx, toolList });
  };
  return selectorExecute;
}

export function useEmbeddedContext() {
  const set = new Set<string>();
  return {
    isEmbedded: (ctx: AgenticaContext) =>
      set.has(JSON.stringify(ctx.operations.array)),
    setEmbedded: (ctx: AgenticaContext) => {
      set.add(JSON.stringify(ctx.operations.array));
    },
  } as const;
}
