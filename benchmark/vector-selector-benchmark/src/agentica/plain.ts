import type { IAgenticaVendor } from "@agentica/core";
import type { IHttpConnection } from "@samchon/openapi";

import { Agentica, assertHttpController } from "@agentica/core";
import ShoppingApi from "@samchon/shopping-api";

export async function plainAgentica(props: {
  vendor: IAgenticaVendor;
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
      href: "http://localhost:3000/@agentica/pg-vector-selector-benchmark/agentica/plain",
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
  });

  return agent;
}
