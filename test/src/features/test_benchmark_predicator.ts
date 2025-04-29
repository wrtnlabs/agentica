import type { IAgenticaBenchmarkExpected } from "@agentica/benchmark/src/structures/IAgenticaBenchmarkExpected";
import type { AgenticaOperation } from "@agentica/core";
import type { OpenApi } from "@samchon/openapi";

import { AgenticaBenchmarkPredicator } from "@agentica/benchmark/src/internal/AgenticaBenchmarkPredicator";
import { Agentica } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import { HttpLlm } from "@samchon/openapi";

export async function test_benchmark_predicator(): Promise<void> {
  // ----
  // PREPARATIONS
  // ----
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: null!,
    },
    controllers: [
      {
        protocol: "http",
        name: "shopping",
        application: HttpLlm.application({
          model: "chatgpt",
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
  ): AgenticaOperation<"chatgpt"> => {
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

  // ----
  // MONOTONIC SCENARIOS
  // ----
  TestValidator.equals("standalone")(true)(
    AgenticaBenchmarkPredicator.success({
      expected: {
        type: "standalone",
        operation: find("patch", "/shoppings/customers/sales"),
      },
      operations: [find("patch", "/shoppings/customers/sales")],
      strict: false,
    }),
  );

  TestValidator.equals("array")(true)(
    AgenticaBenchmarkPredicator.success({
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
            type: "standalone",
            operation: find("post", "/shoppings/customers/orders"),
          },
        ],
      },
      operations: [
        find("patch", "/shoppings/customers/sales"),
        find("get", "/shoppings/customers/sales/{id}"),
        find("post", "/shoppings/customers/orders"),
      ],
      strict: false,
    }),
  );

  TestValidator.equals("anyOf")(true)(
    AgenticaBenchmarkPredicator.success({
      expected: {
        type: "anyOf",
        anyOf: [
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
      operations: [find("post", "/shoppings/customers/orders")],
      strict: false,
    }),
  );

  // ----
  // COMPLICATE SCENARIOS
  // ----
  TestValidator.equals("array in array")(true)(
    AgenticaBenchmarkPredicator.success({
      expected: {
        type: "array",

        items: [
          {
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
            ],
          } satisfies IAgenticaBenchmarkExpected.IArray<"chatgpt">,
          /**
           * It is incorrect type, but it is not a problem because it just test code
           * Code that tests overlapping arrays, but is not allowed as a type.
           */
        ] as unknown as IAgenticaBenchmarkExpected.IAllOf<"chatgpt">[],
      },
      operations: [
        find("patch", "/shoppings/customers/sales"),
        find("get", "/shoppings/customers/sales/{id}"),
      ],
      strict: false,
    }),
  );

  TestValidator.equals("anyOf and array")(true)(
    AgenticaBenchmarkPredicator.success({
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
          {
            type: "standalone",
            operation: find(
              "post",
              "/shoppings/customers/orders/{orderId}/publish",
            ),
          },
        ],
      },
      operations: [
        find("patch", "/shoppings/customers/sales"),
        find("get", "/shoppings/customers/sales/{id}"),
        find("post", "/shoppings/customers/carts/commodities"),
        find("post", "/shoppings/customers/orders"),
        find("post", "/shoppings/customers/orders/{orderId}/publish"),
      ],
      strict: false,
    }),
  );

  // ----
  // COMPLEX PATTERNS
  // ----
  TestValidator.equals("complex nested patterns with anyOf, allOf, and array")(
    true,
  )(
    AgenticaBenchmarkPredicator.success({
      expected: {
        type: "allOf",
        allOf: [
          {
            type: "array",
            items: [
              {
                type: "standalone",
                operation: find("patch", "/shoppings/customers/sales"),
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
                          "get",
                          "/shoppings/customers/sales/{id}",
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
                    operation: find(
                      "post",
                      "/shoppings/customers/orders/direct",
                    ),
                  },
                ],
              },
            ],
          },
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
                type: "allOf",
                allOf: [
                  {
                    type: "standalone",
                    operation: find(
                      "post",
                      "/shoppings/customers/orders/{orderId}/publish",
                    ),
                  },
                  {
                    type: "anyOf",
                    anyOf: [
                      {
                        type: "standalone",
                        operation: find(
                          "get",
                          "/shoppings/customers/sales/{id}",
                        ),
                      },
                      {
                        type: "standalone",
                        operation: find("patch", "/shoppings/admins/sales"),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      operations: [
        find("patch", "/shoppings/customers/sales"),
        find("get", "/shoppings/customers/sales/{id}"),
        find("post", "/shoppings/customers/orders"),
        find("post", "/shoppings/customers/carts/commodities"),
        find("post", "/shoppings/customers/orders/{orderId}/publish"),
        find("get", "/shoppings/customers/sales/{id}"),
      ],
      strict: false,
    }),
  );
}
