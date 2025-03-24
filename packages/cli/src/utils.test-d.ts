import type { Brand } from "./utils";

describe("brand", () => {
  it("should create a brand type", () => {
    const service: string & Brand<"service"> = "aws-s3";

    /** should match the brand type */
    expectTypeOf(service).toEqualTypeOf<string & Brand<"service">>();

    /** should not match the brand type */
    expectTypeOf(service).not.toEqualTypeOf<string>();

    /** should not match the other brand type */
    expectTypeOf(service).not.toEqualTypeOf<string & Brand<"other">>();
  });
});
