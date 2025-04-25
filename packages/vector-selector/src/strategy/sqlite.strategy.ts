import type { AgenticaContext, AgenticaOperation } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { Database } from "better-sqlite3";
import type { Cohere } from "cohere-ai";
import { CohereClientV2 } from "cohere-ai";

import type { IAgenticaVectorSelectorStrategy } from "..";

import { generateHashFromCtx, getRetry, groupByArray } from "../utils";
import { load } from "sqlite-vec";

export interface IAgenticaSqliteVectorSelectorStrategyProps {
  db: Database;
  cohereApiKey: string;
}

const retry = getRetry(3);
const hashMemo = new Map<object, string>();
export function configureSqliteStrategy<SchemaModel extends ILlmSchema.Model>(props: IAgenticaSqliteVectorSelectorStrategyProps): IAgenticaVectorSelectorStrategy<SchemaModel> {
  // eslint-disable-next-line ts/no-unsafe-assignment
  const { db, cohereApiKey } = props;
  load(db);

  const cohere = new CohereClientV2({
    token: cohereApiKey,
  });

  // eslint-disable-next-line ts/no-unsafe-call, ts/no-unsafe-member-access
  db.exec(`
    CREATE TABLE IF NOT EXISTS _agentica_vector_selector_embeddings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      vector BLOB NOT NULL
    )
  `);

  async function embed(text: string, inputType: Cohere.EmbedInputType) {
    const result = await retry(async () => cohere.embed({
      texts: [text],
      inputType,
      model: "embed-multilingual-light-v3.0",
      embeddingTypes: ["float"],
    }));

    if ((result.embeddings.float == null) || result.embeddings.float.length === 0) {
      throw new Error("no float embeddings returned");
    }
    const vector = result.embeddings.float![0]!;
    return vector;
  }
  // it's memoized to avoid generating the same hash for the same context
  // if you know react, it's like useMemo
  const getHash = (ctx: AgenticaContext<SchemaModel>) => {
    if (hashMemo.has(ctx)) {
      return hashMemo.get(ctx)!;
    }
    const hash = generateHashFromCtx(ctx);
    hashMemo.set(ctx, hash);
    return hash;
  };

  // embed each operation in the context.opersation.array
  async function embedOperation(props: {
    hash: string;
    operation: AgenticaOperation<SchemaModel>;
  }): Promise<void> {
    const name = props.operation.function.name;

    const embedding = await retry(async () => embed(props.operation.function.description ?? name, "search_document"));
    // eslint-disable-next-line ts/no-unsafe-call
    db
      // eslint-disable-next-line ts/no-unsafe-member-access
      .prepare("INSERT INTO _agentica_vector_selector_embeddings (hash, name, description, vector) VALUES (?, ?, ?, vec_f32(?))")
      // eslint-disable-next-line ts/no-unsafe-member-access
      .run(props.hash, name, props.operation.function.description, JSON.stringify(embedding));
  }

  async function embedContext(props: {
    ctx: AgenticaContext<SchemaModel>;
    setEmbedded: () => void;
  }): Promise<void> {
    const hash = getHash(props.ctx);

    const prepared = db.prepare(`SELECT name FROM _agentica_vector_selector_embeddings WHERE hash = ?`).all(hash);
    if(prepared.length > 0) {
      props.setEmbedded();
      return;
    }

    await groupByArray(props.ctx.operations.array, 10).reduce(async (accPromise, cur) => {
      await accPromise;
      await Promise.all(cur.map(async v => embedOperation({ hash, operation: v })));
      return Promise.resolve();
    }, Promise.resolve());
    props.setEmbedded();
  }

  async function searchTool(ctx: AgenticaContext<SchemaModel>, query: string): Promise<{
    name: string;
    description: string | undefined;
  }[]> {
    const hash = getHash(ctx);
    const vector = await embed(query, "search_query");

    const result = db.prepare(`
        SELECT name, description, vec_distance_L2(vector, ?) as distance
        FROM _agentica_vector_selector_embeddings
        WHERE hash = ?
        ORDER BY distance
        LIMIT 10
    `).all(JSON.stringify(vector), hash) as {
      name: string;
      description: string;
      distance: number;
    }[];
    return result;
  }

  return {
    searchTool,
    embedContext,
  };
}
