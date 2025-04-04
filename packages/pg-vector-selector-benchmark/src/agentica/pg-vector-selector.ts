import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpConnection } from "@samchon/openapi";

import { Agentica, assertHttpLlmApplication } from "@agentica/core";
import ShoppingApi from "@samchon/shopping-api";

import { AgenticaPgVectorSelector } from "../../../pg-vector-selector/src";

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

  const selectorExecute = AgenticaPgVectorSelector.boot<"chatgpt">({
    connectorHiveConnection: {
      host: props.connectorHiveUrl,
    },
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

  return agent;
}
