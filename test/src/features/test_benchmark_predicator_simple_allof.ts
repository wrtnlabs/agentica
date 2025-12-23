import type { AgenticaOperation } from "@agentica/core";
import type { OpenApi } from "@samchon/openapi";

import { AgenticaBenchmarkPredicator } from "@agentica/benchmark/src/internal/AgenticaBenchmarkPredicator";
import { Agentica } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import { HttpLlm } from "@samchon/openapi";

export async function test_benchmark_predicator_simple_allof(): Promise<void> {
  // ----
  // PREPARATIONS
  // ----
  const agent: Agentica = new Agentica({
    vendor: {
      model: "gpt-4o-mini",
      api: null!,
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
        connection: {
          host: "https://shopping-be.wrtn.ai",
        },
      },
    ],
  });

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

  TestValidator.equals("allOf")(true)(
    AgenticaBenchmarkPredicator.success({
      expected: {
        type: "allOf",
        allOf: [
          {
            type: "standalone",
            operation: find("post", "/shoppings/customers/carts/commodities"),
          },
          {
            type: "standalone",
            operation: find("post", "/shoppings/customers/orders"),
          },
        ],
      },
      operations: [
        find("post", "/shoppings/customers/carts/commodities"),
        find("post", "/shoppings/customers/orders"),
      ],
      strict: false,
    }),
  );
}
