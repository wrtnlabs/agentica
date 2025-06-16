import { capitalize, insertWithIndent } from "./utils";

describe("capitalize", () => {
  it("should return a string with the first letter capitalized", () => {
    expect(capitalize("aws-s3")).toBe("AwsS3");
    expect(capitalize("chatgpt")).toBe("Chatgpt");
  });
});

describe("insertWithIndent", () => {
  it("should return the same content if indent is not available", async () => {
    const content = `
    function foo() {
      /// INSERT HERE
    }
    `;

    const code = `
    if (x) {
      doSomething();
    }
    `;

    const result = insertWithIndent(content, "/// INSERT HERE", code);

    expect(result).toBe(`
    function foo() {
      
      if (x) {
        doSomething();
      }
    
    }
    `);
  });
});
