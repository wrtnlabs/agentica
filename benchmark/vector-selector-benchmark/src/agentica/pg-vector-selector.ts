import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpConnection } from "@samchon/openapi";

import { Agentica, assertHttpController } from "@agentica/core";
import { BootAgenticaVectorSelector } from "@agentica/vector-selector";
import { configurePostgresStrategy } from "@agentica/vector-selector/strategy";
import ShoppingApi from "@samchon/shopping-api";

export async function pgVectorSelectorAgentica(props: {
  vendor: IAgenticaVendor;
  connectorHiveUrl: string;
}) {
  if (
    !(
      await fetch(
        `${props.connectorHiveUrl}/health`,
      ).catch(() => ({ ok: false }))
    ).ok
  ) {
    throw new Error("Connector Hive is not running");
  }

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
    strategy: configurePostgresStrategy({
      host: props.connectorHiveUrl,
    }),
  });

  // CREATE AI AGENT
  const document = await fetch("https://raw.githubusercontent.com/samchon/shopping-backend/refs/heads/master/packages/api/swagger.json").then(async res => res.json() as Promise<unknown>);
  const agent = new Agentica({
    vendor: props.vendor,
    controllers: [
      assertHttpController({
        name: "shopping",
        document,
        connection,
      }),
    ],
    config: {
      executor: {
        select: selectorExecute,
      },
    },
  });

  return agent;
}
