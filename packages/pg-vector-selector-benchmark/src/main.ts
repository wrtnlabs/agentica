import { mkdir, rmdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { config } from "dotenv";
import OpenAI from "openai";

import { pgVectorSelectorAgentica as pgVectorSelector, plainAgentica as plain } from "./agentica";
import { runShoppingBenchmark } from "./runShoppingBenchmark";

config();

const apiKey = process.env.OPENAI_API_KEY;
if (apiKey === undefined || apiKey.length === 0) {
  throw new Error("OPENAI_API_KEY is not set");
}

async function main() {
  const plainAgentica = await plain({
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({ apiKey }),
    },
  });

  const pgVectorSelectorAgentica = await pgVectorSelector({
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({ apiKey }),
    },
    connectorHiveUrl: process.env.CONNECTOR_HIVE_URL!,
  });

  const reports = await Promise.all([
    runShoppingBenchmark({ agent: plainAgentica })
      .then(v => ({ result: v, name: "plain" })),

    runShoppingBenchmark({ agent: pgVectorSelectorAgentica })
      .then(v => ({ result: v, name: "pgVectorSelector" })),
  ])
    .then(reportList => reportList.map(v =>
      ({ name: v.name, result: v.result.report() }),
    ));

  await reports.reduce(async (awiater, docs) => {
    await awiater;
    const root: string = `./docs/benchmarks/call/${docs.name}`;

    // ignore not exists error
    await rmdir(root).catch(() => {});

    for (const [key, value] of Object.entries(docs.result)) {
      await mkdir(path.join(root, key.split("/").slice(0, -1).join("/")), { recursive: true });
      await writeFile(path.join(root, key), value);
    }
  }, Promise.resolve());
}

main().catch(e => console.error(e));
