import type { Agentica, AgenticaOperation } from "@agentica/core";
import type { ILlmSchema, OpenApi } from "@samchon/openapi";

import { AgenticaCallBenchmark } from "@agentica/benchmark";

export interface ShoppingBenchmarkConfig<Model extends ILlmSchema.Model> {
  agent: Agentica<Model>;
}

export async function runShoppingBenchmark<Model extends ILlmSchema.Model>({ agent }: ShoppingBenchmarkConfig<Model>): Promise<AgenticaCallBenchmark<Model>> {
  // DO BENCHMARK
  const find = (
    method: OpenApi.Method,
    path: string,
  ): AgenticaOperation<Model> => {
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

  const benchmark: AgenticaCallBenchmark<Model> = new AgenticaCallBenchmark(
    {
      agent,
      config: {
        repeat: 10,
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
  return benchmark;
}
