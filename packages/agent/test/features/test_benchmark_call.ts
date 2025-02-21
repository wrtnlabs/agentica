import { HttpLlm, IHttpConnection, OpenApi } from "@samchon/openapi";
import ShoppingApi from "@samchon/shopping-api";
import { IWrtnAgentOperation, WrtnAgent } from "@wrtnlabs/agent";
import { WrtnAgentCallBenchmark } from "@wrtnlabs/agent/lib/benchmark/call/WrtnAgentCallBenchmark";
import fs from "fs";
import OpenAI from "openai";
import path from "path";

import { TestGlobal } from "../TestGlobal";

export const test_benchmark_call = async (): Promise<void> => {
  // HANDLESHAKE WITH SHOPPING BACKEND
  const connection: IHttpConnection = {
    host: "https://shopping-be.wrtn.ai",
  };
  await ShoppingApi.functional.shoppings.customers.authenticate.create(
    connection,
    {
      channel_code: "samchon",
      external_user: null,
      href: "http://localhost:3000/@wrtnlabs/agent/test_benchmark_call",
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
  const agent: WrtnAgent = new WrtnAgent({
    provider: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: process.env.CHATGPT_API_KEY,
      }),
      type: "chatgpt",
    },
    controllers: [
      {
        protocol: "http",
        name: "shopping",
        application: HttpLlm.application({
          model: "chatgpt",
          document: await fetch(
            "https://shopping-be.wrtn.ai/editor/swagger.json",
          ).then((res) => res.json()),
        }),
        connection,
      },
    ],
  });

  // DO BENCHMARK
  const find = (method: OpenApi.Method, path: string): IWrtnAgentOperation => {
    const found = agent
      .getOperations()
      .find(
        (op) =>
          op.protocol === "http" &&
          op.function.method === method &&
          op.function.path === path,
      );
    if (!found) throw new Error(`Operation not found: ${method} ${path}`);
    return found;
  };
  const benchmark: WrtnAgentCallBenchmark = new WrtnAgentCallBenchmark({
    agent,
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
          "",
          "At last, take the shopping cart to the order.",
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
                  type: "array",
                  items: [
                    {
                      type: "standalone",
                      operation: find(
                        "post",
                        "/shoppings/customers/carts/commodities",
                      ),
                    },
                    {
                      type: "standalone",
                      operation: find("post", "/shoppings/customers/orders"),
                    },
                  ],
                },
                {
                  type: "standalone",
                  operation: find("post", "/shoppings/customers/orders/direct"),
                },
              ],
            },
          ],
        },
      },
    ],
  });
  await benchmark.execute();

  // REPORT
  const docs: Record<string, string> = benchmark.report();
  const root: string = `${TestGlobal.ROOT}/test/docs/benchmarks/call`;

  await rmdir(root);
  for (const [key, value] of Object.entries(docs)) {
    await mkdir(path.join(root, key.split("/").slice(0, -1).join("/")));
    await fs.promises.writeFile(path.join(root, key), value, "utf8");
  }
};

const mkdir = async (str: string) => {
  try {
    await fs.promises.mkdir(str, {
      recursive: true,
    });
  } catch {}
};
const rmdir = async (str: string) => {
  try {
    await fs.promises.rm(str, {
      recursive: true,
    });
  } catch {}
};
