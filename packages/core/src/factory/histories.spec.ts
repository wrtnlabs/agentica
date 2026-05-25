import { createExecuteHistory, decodeHistories, decodeHistory } from "./histories";

describe("histories", () => {
  interface ToolContent {
    value: any;
  }

  function parseToolContent(message: unknown): ToolContent {
    if (
      typeof message !== "object"
      || message === null
      || "content" in message === false
      || typeof message.content !== "string"
    ) {
      throw new Error("Expected tool message with string content");
    }
    return JSON.parse(message.content) as ToolContent;
  }

  const operation = {
    protocol: "class",
    name: "testFunction",
    function: {
      description: "test function",
      parameters: {},
      output: {},
    },
    toJSON: () => ({
      protocol: "class",
      controller: "test",
      function: "testFunction",
    }),
  } as any;

  it("should preserve assistant payloads on decoded tool-call histories", () => {
    const history = createExecuteHistory({
      id: "call_1",
      created_at: "2026-04-26T00:00:00.000Z",
      operation,
      arguments: { value: 1 },
      value: { ok: true },
      success: true,
      assistant: {
        reasoning_content: "reasoning content",
      },
    });

    const [assistant] = decodeHistory(history);

    expect((assistant as any).reasoning_content).toBe("reasoning content");
  });

  it("should keep execute result values unchanged without result budget", () => {
    const history = createExecuteHistory({
      id: "call_1",
      created_at: "2026-04-26T00:00:00.000Z",
      operation,
      arguments: {},
      value: { text: "abcdefghijklmnopqrstuvwxyz" },
      success: true,
    });

    const [, tool] = decodeHistory(history);
    const content = parseToolContent(tool);

    expect(content.value.text).toBe("abcdefghijklmnopqrstuvwxyz");
  });

  it("should project large execute results as preview references", () => {
    const history = createExecuteHistory({
      id: "call_1",
      created_at: "2026-04-26T00:00:00.000Z",
      operation,
      arguments: {},
      value: { text: "abcdefghijklmnopqrstuvwxyz" },
      success: true,
    });

    const [, tool] = decodeHistory(history, {
      resultBudget: {
        maxResultCharacters: 12,
      },
    });
    const content = parseToolContent(tool);

    expect(content.value).toEqual({
      __agentica_result__: "truncated",
      reference: "execute:call_1:value",
      operation: "testFunction",
      originalCharacters: JSON.stringify({ text: "abcdefghijklmnopqrstuvwxyz" }).length,
      preview: JSON.stringify({ text: "abcdefghijklmnopqrstuvwxyz" }).slice(0, 12),
    });
    expect(JSON.stringify(content)).not.toContain("mnopqrstuvwxyz");
  });

  it("should preserve the most recent execute results when configured", () => {
    const oldHistory = createExecuteHistory({
      id: "call_old",
      created_at: "2026-04-26T00:00:00.000Z",
      operation,
      arguments: {},
      value: { text: "oldabcdefghijklmnopqrstuvwxyz" },
      success: true,
    });
    const recentHistory = createExecuteHistory({
      id: "call_recent",
      created_at: "2026-04-26T00:00:01.000Z",
      operation,
      arguments: {},
      value: { text: "recentabcdefghijklmnopqrstuvwxyz" },
      success: true,
    });

    const messages = decodeHistories([oldHistory, recentHistory], {
      resultBudget: {
        maxResultCharacters: 12,
        preserveRecentResults: 1,
      },
    });
    const oldContent = parseToolContent(messages[1]);
    const recentContent = parseToolContent(messages[3]);

    expect(oldContent.value.__agentica_result__).toBe("truncated");
    expect(recentContent.value.text).toBe("recentabcdefghijklmnopqrstuvwxyz");
  });
});
