import { capitalize } from "./utils";

describe("capitalize", () => {
  it("should return a string with the first letter capitalized", () => {
    expect(capitalize("aws-s3")).toBe("AwsS3");
    expect(capitalize("chatgpt")).toBe("Chatgpt");
  });
})

