import { generateConnectorsArrayCode } from "./connectors";

describe("generateConnectorsArrayCode", () => {
  it("should be empty string when services is empty", () => {
    const result = generateConnectorsArrayCode([]);
    expect(result).toBe("");
  });

  it("should generate connectors array code with one service", () => {
    const result = generateConnectorsArrayCode(["chatgpt"]);
    expect(result).toBe(`{
name: "Chatgpt Connector",
protocol: "class",
application: typia.llm.application<ChatgptService, "chatgpt">(),
execute: new ChatgptService(),
}`);
  });

  it("should generate connectors array code with multiple services", () => {
    const result = generateConnectorsArrayCode(["chatgpt", "openai"]);
    expect(result).toBe(`{
name: "Chatgpt Connector",
protocol: "class",
application: typia.llm.application<ChatgptService, "chatgpt">(),
execute: new ChatgptService(),
},
{
name: "Openai Connector",
protocol: "class",
application: typia.llm.application<OpenaiService, "chatgpt">(),
execute: new OpenaiService(),
}`);
  });
})
