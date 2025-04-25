import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import Database from "better-sqlite3";
import { config } from "dotenv";
import OpenAI from "openai";

import { pgVectorSelectorAgentica, plainAgentica, sqliteVectorSelectorAgentica } from "./agentica";
import { runShoppingBenchmark } from "./runShoppingBenchmark";

config();

const apiKey = process.env.OPENAI_API_KEY;
if (apiKey === undefined || apiKey.length === 0) {
  throw new Error("OPENAI_API_KEY is not set");
}

async function main() {
  const db = new Database(":memory:");
  const reports = await Promise.all([
    runShoppingBenchmark({ agent: await plainAgentica({
      vendor: {
        model: "gpt-4o-mini",
        api: new OpenAI({ apiKey }),
      },
    }) })
      .then(v => ({ result: v, name: "plain" })),
    runShoppingBenchmark({ agent: await pgVectorSelectorAgentica({
      vendor: {
        model: "gpt-4o-mini",
        api: new OpenAI({ apiKey }),
      },
      connectorHiveUrl: process.env.CONNECTOR_HIVE_URL!,
    }) })
      .then(v => ({ result: v, name: "pgVectorSelector" })),

    runShoppingBenchmark({ agent: await sqliteVectorSelectorAgentica({
      vendor: {
        model: "gpt-4o-mini",
        api: new OpenAI({ apiKey }),
      },
      cohereApiKey: process.env.COHERE_API_KEY!,
      db,
    }) })
      .then(v => ({ result: v, name: "sqliteVectorSelector" })),
  ])
    .then(reportList => reportList.map(v =>
      ({ name: v.name, result: v.result.report() }),
    ));

  db.close();
  await reports.reduce(async (awiater, docs) => {
    await awiater;
    const root: string = `./docs/benchmarks/call/${docs.name}`;

    // ignore not exists error
    await rm(root, { recursive: true }).catch(() => {});

    for (const [key, value] of Object.entries(docs.result)) {
      await mkdir(path.join(root, key.split("/").slice(0, -1).join("/")), { recursive: true });
      await writeFile(path.join(root, key), value);
    }
  }, Promise.resolve());
}

Promise.resolve()
  .then(() => {
    console.time("executed");
  })
  .then(main)
  .then(() => {
    console.timeEnd("executed");
  })
  .catch(e => console.error(e));
