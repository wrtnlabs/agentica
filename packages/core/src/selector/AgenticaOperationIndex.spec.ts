import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";

import { select } from "../orchestrate/select";

import { AgenticaOperationIndex } from "./AgenticaOperationIndex";

describe("agenticaOperationIndex", () => {
  it("tokenizes camel case, separators, and path segments", () => {
    expect(
      AgenticaOperationIndex.tokenize("getUserProfile /bbs-articles/{article_id}"),
    ).toEqual(expect.arrayContaining([
      "get",
      "user",
      "profile",
      "bbs",
      "articles",
      "article",
      "id",
    ]));
  });

  it("ranks an exact operation name first", () => {
    const index = new AgenticaOperationIndex({
      operations: [
        operation({ name: "deleteUserProfile", description: "Remove a user" }),
        operation({ name: "getUserProfile", description: "Read a user profile" }),
      ],
    });

    expect(index.search("getUserProfile")[0]?.operation.name).toBe("getUserProfile");
  });

  it("supports direct select with comma separated operation keys", () => {
    const index = new AgenticaOperationIndex({
      operations: [
        operation({ name: "getUserProfile", description: "Read a user" }),
        operation({ name: "deleteUserProfile", description: "Remove a user" }),
        operation({ name: "listOrders", description: "List orders" }),
      ],
    });

    const results = index.search("select:deleteUserProfile,getUserProfile");

    expect(results.map(r => r.operation.name)).toEqual([
      "deleteUserProfile",
      "getUserProfile",
    ]);
    expect(results.every(r => r.direct)).toBe(true);
  });

  it("filters candidates with required terms", () => {
    const index = new AgenticaOperationIndex({
      operations: [
        operation({ name: "updateProfile", description: "Update a profile" }),
        operation({ name: "updateInvoice", description: "Update an invoice" }),
      ],
    });

    expect(index.search("update +profile").map(r => r.operation.name)).toEqual([
      "updateProfile",
    ]);
  });

  it("weights curated search hints above description-only matches", () => {
    const index = new AgenticaOperationIndex({
      operations: [
        operation({
          name: "listProducts",
          description: "List discounted catalog items",
        }),
        operation({
          name: "calculatePrice",
          description: "Calculate order price",
          searchHint: "discount coupon promotion",
        }),
      ],
    });

    expect(index.search("discount")[0]?.operation.name).toBe("calculatePrice");
  });

  it("matches HTTP method, path, and tags", () => {
    const index = new AgenticaOperationIndex({
      operations: [
        operation({
          protocol: "http",
          name: "searchArticles",
          description: "Search board articles",
          method: "PATCH",
          path: "/bbs/articles",
          tags: ["bbs"],
        }),
        operation({
          protocol: "http",
          name: "createComment",
          description: "Create comment",
          method: "POST",
          path: "/bbs/comments",
          tags: ["comment"],
        }),
      ],
    });

    expect(index.search("PATCH /bbs/articles")[0]?.operation.name).toBe(
      "searchArticles",
    );
  });

  it("matches parameter names and descriptions", () => {
    const index = new AgenticaOperationIndex({
      operations: [
        operation({
          name: "sendEmail",
          description: "Send a message",
          parameters: {
            type: "object",
            properties: {
              email: {
                type: "string",
                description: "Recipient email address",
              },
            },
          },
        }),
        operation({
          name: "sendSms",
          description: "Send SMS",
        }),
      ],
    });

    expect(index.search("recipient email")[0]?.operation.name).toBe("sendEmail");
  });

  it("changes registry version when the operation signature changes", () => {
    const before = new AgenticaOperationIndex({
      operations: [operation({ name: "getUser", description: "Read user" })],
    });
    const after = new AgenticaOperationIndex({
      operations: [operation({ name: "getUser", description: "Read account" })],
    });

    expect(before.registryVersion).not.toBe(after.registryVersion);
  });

  it("selects local candidates without calling the LLM", async () => {
    const operations = [
      operation({ name: "sendEmail", description: "Send email" }),
      operation({ name: "deleteUser", description: "Delete user" }),
    ];
    const ctx: AgenticaContext = {
      operations: {
        array: operations,
        flat: new Map(operations.map(op => [op.name, op])),
        group: new Map(),
      },
      config: {
        selector: {
          type: "local",
          topK: 1,
        },
      },
      histories: [],
      stack: [],
      prompt: {
        id: "prompt",
        type: "userMessage",
        created_at: new Date().toISOString(),
        contents: [{ type: "text", text: "send an email to the customer" }],
        toJSON: () => ({
          id: "prompt",
          type: "userMessage",
          created_at: "",
          contents: [{ type: "text", text: "send an email to the customer" }],
        }),
      },
      abortSignal: undefined,
      ready: () => true,
      dispatch: async () => {},
      request: async () => {
        throw new Error("LLM request must not be called in local selector mode");
      },
      initialize: async () => {},
    };

    await select(ctx);

    expect(ctx.stack.map(s => s.operation.name)).toEqual(["sendEmail"]);
  });
});

function operation(props: {
  protocol?: "class" | "http" | "mcp";
  name: string;
  description: string;
  parameters?: unknown;
  method?: string;
  path?: string;
  tags?: string[];
  searchHint?: string;
}): AgenticaOperation {
  const protocol = props.protocol ?? "class";
  const controller = {
    protocol,
    name: `${protocol}Controller`,
    application: {
      functions: [],
    },
  };
  const func = {
    name: props.name,
    description: props.description,
    parameters: props.parameters ?? {
      type: "object",
      properties: {},
    },
    output: {
      type: "object",
    },
    method: props.method,
    path: props.path,
    tags: props.tags,
    searchHint: props.searchHint,
    validate: (input: unknown) => ({
      success: true,
      data: input,
    }),
    parse: (input: string) => ({
      success: true,
      data: JSON.parse(input),
    }),
  };
  return {
    protocol,
    controller,
    function: func,
    name: props.name,
    toJSON: () => ({
      protocol,
      controller: controller.name,
      function: props.name,
      name: props.name,
    }),
  } as unknown as AgenticaOperation;
}
