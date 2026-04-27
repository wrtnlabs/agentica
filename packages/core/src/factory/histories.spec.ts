import { createExecuteHistory, decodeHistory } from "./histories";

describe("histories", () => {
  it("should preserve assistant payloads on decoded tool-call histories", () => {
    const history = createExecuteHistory({
      id: "call_1",
      created_at: "2026-04-26T00:00:00.000Z",
      operation: {
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
      } as any,
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
});
