import { generateConnectorsArrayCode, generateServiceImportsCode } from "./connectors";

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

  it("should generate connectors array code with one service with '-' in name", () => {
    const result = generateConnectorsArrayCode(["aws-s3"]);
    expect(result).toBe(`{
name: "AwsS3 Connector",
protocol: "class",
application: typia.llm.application<AwsS3Service, "chatgpt">(),
execute: new AwsS3Service(),
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
 } )


describe("generateServiceImportsCode", () => {
  it("should be empty string when services is empty", () => {
    const result = generateServiceImportsCode([]);
    expect(result).toBe("");
  });

  it("should generate import statements with one service", () => {
    const result = generateServiceImportsCode(["chatgpt"]);
    expect(result).toBe(`import { ChatgptService } from "@wrtnlabs/connector-chatgpt";`);
  });

  it("should generate import statements with one service with '-' in name", () => {
    const result = generateServiceImportsCode(["aws-s3"]);
    expect(result).toBe(`import { AwsS3Service } from "@wrtnlabs/connector-aws-s3";`);
  });

  it("should generate import statements with multiple services", () => {
    const result = generateServiceImportsCode(["chatgpt", "openai"]);
    expect(result).toBe(`import { ChatgptService } from "@wrtnlabs/connector-chatgpt";
import { OpenaiService } from "@wrtnlabs/connector-openai";`);
  });

  it("should generate import statements with multiple services in different order", () => {
    const result = generateServiceImportsCode(["openai", "chatgpt"]);
    expect(result).toBe(`import { OpenaiService } from "@wrtnlabs/connector-openai";
import { ChatgptService } from "@wrtnlabs/connector-chatgpt";`);
  });
});
