import fs from "node:fs";
import path from "node:path";

import type { AgenticaOperation } from "@agentica/core";
import type { IHttpConnection, OpenApi } from "@samchon/openapi";

import { AgenticaCallBenchmark } from "@agentica/benchmark";
import { Agentica } from "@agentica/core";
import { HttpLlm } from "@samchon/openapi";
import ShoppingApi from "@samchon/shopping-api";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_benchmark_call(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
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
      href: "http://localhost:3000/@agentica/core/test_benchmark_call",
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
  const agent: Agentica = new Agentica({
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
      }),
    },
    controllers: [
      {
        protocol: "http",
        name: "shopping",
        application: HttpLlm.application({
          document: await fetch(
            "https://shopping-be.wrtn.ai/editor/swagger.json",
          ).then(async res => res.json() as Promise<OpenApi.IDocument>),
        }),
        connection,
      },
    ],
  });

  // DO BENCHMARK
  const find = (
    method: OpenApi.Method,
    path: string,
  ): AgenticaOperation => {
    const found = agent
      .getOperations()
      .find(
        op =>
          op.protocol === "http"
          && op.function.method === method
          && op.function.path === path,
      );
    if (found === undefined) {
      throw new Error(`Operation not found: ${method} ${path}`);
    }
    return found;
  };
  const benchmark: AgenticaCallBenchmark = new AgenticaCallBenchmark(
    {
      agent,
      config: {
        repeat: 4,
      },
      scenarios: [
        {
          name: "order",
          text: [
            "I wanna see every sales in the shopping mall",
            "",
            "And then show me the detailed information about the Macbook.",
            "",
            "After that, select the most expensive stock",
            "from the Macbook, and put it into my shopping cart.",
            "And take the shopping cart to the order.",
            "",
            "At last, I'll publish it by cash payment, and my address is",
            "",
            "  - country: South Korea",
            "  - city/province: Seoul",
            "  - department: Wrtn Apartment",
            "  - Possession: 101-1411",
          ].join("\n"),
          expected: {
            type: "array",
            items: [
              {
                type: "standalone",
                operation: find("patch", "/shoppings/customers/sales"),
              },
              {
                type: "standalone",
                operation: find("get", "/shoppings/customers/sales/{id}"),
              },
              {
                type: "anyOf",
                anyOf: [
                  {
                    type: "standalone",
                    operation: find("post", "/shoppings/customers/orders"),
                  },
                  {
                    type: "standalone",
                    operation: find(
                      "post",
                      "/shoppings/customers/orders/direct",
                    ),
                  },
                ],
              },
              {
                type: "standalone",
                operation: find(
                  "post",
                  "/shoppings/customers/orders/{orderId}/publish",
                ),
              },
            ],
          },
        },
      ],
    },
  );
  await benchmark.execute();

  // REPORT
  const docs: Record<string, string> = benchmark.report();
  const root: string = `${TestGlobal.ROOT}/docs/benchmarks/call`;

  await rmdir(root);
  for (const [key, value] of Object.entries(docs)) {
    await mkdir(path.join(root, key.split("/").slice(0, -1).join("/")));
    await fs.promises.writeFile(path.join(root, key), value, "utf8");
  }
}

async function mkdir(str: string) {
  try {
    await fs.promises.mkdir(str, {
      recursive: true,
    });
  }
  catch {}
}
async function rmdir(str: string) {
  try {
    await fs.promises.rm(str, {
      recursive: true,
    });
  }
  catch {}
}
