import { capitalize, formatWithIndent, formatWithPrettier } from "./utils";

describe("capitalize", () => {
  it("should return a string with the first letter capitalized", () => {
    expect(capitalize("aws-s3")).toBe("AwsS3");
    expect(capitalize("chatgpt")).toBe("Chatgpt");
  });
});

describe("formatWithPrettier", () => {
  it("should return the same content if prettier is not available", async () => {
    const content = `const foo = "bar";\n`;
    const result = await formatWithPrettier(content);
    expect(result).toBe(content);
  });
});

describe("formatWithIndent", () => {
  it("should return the same content if indent is not available", async () => {
    const content = `const foo = "bar";\n`;
    const result = await formatWithIndent(content);
    expect(result).toBe(content);
  });
})