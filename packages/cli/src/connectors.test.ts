import { generateConnectorsArrayCode } from "./connectors";

describe("generateConnectorsArrayCode", () => {
  it("should be empty string when services is empty", () => {
    const result = generateConnectorsArrayCode({ services: [] });
    expect(result).toBe("");
  });

  it("should generate connectors array code with one service", () => {
    const result = generateConnectorsArrayCode({ services: ["chatgpt"] });
    expect(result).toBe(`{
name: "Chatgpt Connector",
protocol: "class",
application: typia.llm.application<ChatgptService, "chatgpt">(),
execute: new ChatgptService(),
}`);
  });

  it("should generate connectors array code with multiple services", () => {
    const result = generateConnectorsArrayCode({ services: ["chatgpt", "openai"] });
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
