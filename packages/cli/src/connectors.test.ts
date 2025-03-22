import type { Service } from "./connectors";
import { generateConnectorsArrayCode, generateServiceImportsCode, getConnectors, getConnectorsList, insertCodeIntoAgenticaStarter, serviceToConnector } from "./connectors";

describe("serviceToConnector", () => {
  it("should return a connector name", () => {
    const connector = serviceToConnector("google-map" as Service);
    expect(connector).toBe("@wrtnlabs/connector-google-map");
  });
});

describe("getConnectorsList", () => {
  it("should return a list of connectors", async () => {
    const connectors = await getConnectorsList();
    expect(connectors).toEqual({
      connectors: [
        "@wrtnlabs/connector-google-map",
      ],
      version: "1.0.0",
    });
  });
});

describe("getConnectors", () => {
  it("should return a list of connectors", async () => {
    const connectors = await getConnectors();
    expect(connectors).toEqual([
      {
        packageName: "@wrtnlabs/connector-google-map",
        serviceName: "google-map",
        displayName: "GOOGLE MAP",
      },
    ]);
  });
});

describe("generateConnectorsArrayCode", () => {
  it("should be empty string when services is empty", () => {
    const result = generateConnectorsArrayCode([]);
    expect(result).toBe("");
  });

  it("should generate connectors array code with one service", () => {
    const result = generateConnectorsArrayCode(["chatgpt"] as Service[]);
    expect(result).toBe(`{
name: "Chatgpt Connector",
protocol: "class",
application: typia.llm.application<ChatgptService, "chatgpt">(),
execute: new ChatgptService(),
}`);
  });

  it("should generate connectors array code with one service with '-' in name", () => {
    const result = generateConnectorsArrayCode(["aws-s3"] as Service[]);
    expect(result).toBe(`{
name: "AwsS3 Connector",
protocol: "class",
application: typia.llm.application<AwsS3Service, "chatgpt">(),
execute: new AwsS3Service(),
}`);
  });

  it("should generate connectors array code with multiple services", () => {
    const result = generateConnectorsArrayCode(["chatgpt", "openai"] as Service[]);
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
});

describe("generateServiceImportsCode", () => {
  it("should be empty string when services is empty", () => {
    const result = generateServiceImportsCode([]);
    expect(result).toBe("");
  });

  it("should generate import statements with one service", () => {
    const result = generateServiceImportsCode(["chatgpt"] as Service[]);
    expect(result).toBe(`import { ChatgptService } from "@wrtnlabs/connector-chatgpt";`);
  });

  it("should generate import statements with one service with '-' in name", () => {
    const result = generateServiceImportsCode(["aws-s3"] as Service[]);
    expect(result).toBe(`import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";`);
  });

  it("should generate import statements with multiple services", () => {
    const result = generateServiceImportsCode(["chatgpt", "openai"] as Service[]);
    expect(result).toBe(`import { ChatgptService } from "@wrtnlabs/connector-chatgpt";
import { OpenaiService } from "@wrtnlabs/connector-openai";`);
  });

  it("should generate import statements with multiple services in different order", () => {
    const result = generateServiceImportsCode(["openai", "chatgpt"] as Service[]);
    expect(result).toBe(`import { OpenaiService } from "@wrtnlabs/connector-openai";
import { ChatgptService } from "@wrtnlabs/connector-chatgpt";`);
  });
});

describe("insertCodeIntoAgenticaStarter", () => {
  it("should insert import and connector code into Agentica Starter template", () => {
    const content = `
/// INSERT IMPORT HERE
/// INSERT CONTROLLER HERE
`;
    const importCode = `import { ChatgptService } from "@wrtnlabs/connector-chatgpt";`;
    const connectorCode = `{
name: "Chatgpt Connector",
protocol: "class",
application: typia.llm.application<ChatgptService, "chatgpt">(),
execute: new ChatgptService(),
}`;
    const result = insertCodeIntoAgenticaStarter({ content, importCode, connectorCode });
    expect(result).toBe(`
import { ChatgptService } from "@wrtnlabs/connector-chatgpt";
{
name: "Chatgpt Connector",
protocol: "class",
application: typia.llm.application<ChatgptService, "chatgpt">(),
execute: new ChatgptService(),
}
`);
  });
});
