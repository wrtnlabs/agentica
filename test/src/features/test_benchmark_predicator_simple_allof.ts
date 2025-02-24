import { AgenticaBenchmarkPredicator } from "@agentica/benchmark/src/internal/AgenticaBenchmarkPredicator";
import { Agentica, IAgenticaOperation } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import { HttpLlm, OpenApi } from "@samchon/openapi";

export const test_benchmark_predicator_simple_allof =
  async (): Promise<void> => {
    //----
    // PREPARATIONS
    //----
    const agent: Agentica = new Agentica({
      provider: {
        model: "gpt-4o-mini",
        api: null!,
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
          connection: {
            host: "https://shopping-be.wrtn.ai",
          },
        },
      ],
    });

    const find = (method: OpenApi.Method, path: string): IAgenticaOperation => {
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
  };
