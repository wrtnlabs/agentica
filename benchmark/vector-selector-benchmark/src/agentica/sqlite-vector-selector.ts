import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpConnection } from "@samchon/openapi";
import type Database from "better-sqlite3";

import { Agentica, AgenticaTokenUsage, assertHttpLlmApplication } from "@agentica/core";
import { BootAgenticaVectorSelector } from "@agentica/vector-selector";
import { configureSqliteStrategy } from "@agentica/vector-selector/strategy";
import ShoppingApi from "@samchon/shopping-api";

export async function sqliteVectorSelectorAgentica(props: {
  vendor: IAgenticaVendor;
  cohereApiKey: string;
  db: Database.Database;
}) {
  // HANDLESHAKE WITH SHOPPING BACKEND
  const connection: IHttpConnection = {
    host: "https://shopping-be.wrtn.ai",
  };
  await ShoppingApi.functional.shoppings.customers.authenticate.create(
    connection,
    {
      channel_code: "samchon",
      external_user: null,
      href: "http://localhost:3000/@agentica/pg-vector-selector-benchmark/agentica/pg-vector-selector",
      referrer: "http://localhost:3000/NodeJS",
    },
  );
  await ShoppingApi.functional.shoppings.customers.authenticate.activate(
    connection,
    {
      mobile: "821012345678",
      name: "John Doe",
    },
  );

  const selectorExecute = BootAgenticaVectorSelector({
    strategy: configureSqliteStrategy<"chatgpt">({
      db: props.db,
      cohereApiKey: props.cohereApiKey,
    }),
  });

  // CREATE AI AGENT
  const document = await fetch("https://shopping-be.wrtn.ai/editor/swagger.json").then(async res => res.json() as Promise<unknown>);
  const agent = new Agentica({
    model: "chatgpt",
    vendor: props.vendor,
    controllers: [
      {
        protocol: "http",
        name: "shopping",
        application: assertHttpLlmApplication({
          model: "chatgpt",
          document,
        }),
        connection,
      },
    ],
    config: {
      executor: {
        select: selectorExecute,
      },
    },
  });

  const ctxForWarmming = agent.getContext({
    prompt: {
      role: "user",
      text: "warmming",
      type: "text",
      toJSON: () => ({
        role: "user",
        text: "warmming",
        type: "text",
      }),
    },
    usage: AgenticaTokenUsage.zero(),
  });
  // warmming
  await selectorExecute(ctxForWarmming);

  return agent;
}
