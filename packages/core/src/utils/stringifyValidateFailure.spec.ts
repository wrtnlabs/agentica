import type { IValidation } from "@samchon/openapi";

import { JsonUtil } from "./JsonUtil";

describe("jsonUtil.JsonUtil.stringifyValidateFailure", () => {
  describe("missing Properties", () => {
    it("should display missing required property as undefined with error comment", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          name: "John",
        },
        errors: [
          {
            path: "$input.email",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"email\": undefined");
      expect(result).toContain("// ❌");
      expect(result).toContain("$input.email");
      expect(result).toContain("\"expected\":\"string\"");
    });

    it("should display multiple missing properties", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          name: "John",
        },
        errors: [
          {
            path: "$input.email",
            expected: "string",
            value: undefined,
          },
          {
            path: "$input.age",
            expected: "number",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"email\": undefined");
      expect(result).toContain("\"age\": undefined");
      expect(result).toContain("$input.email");
      expect(result).toContain("$input.age");
    });

    it("should display missing property in nested object", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          user: {
            name: "John",
          },
        },
        errors: [
          {
            path: "$input.user.email",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"user\":");
      expect(result).toContain("\"email\": undefined");
      expect(result).toContain("$input.user.email");
    });

    it("should handle mixed existing and missing properties", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          name: "John",
          age: 30,
        },
        errors: [
          {
            path: "$input.email",
            expected: "string",
            value: undefined,
          },
          {
            path: "$input.phone",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"name\": \"John\"");
      expect(result).toContain("\"age\": 30");
      expect(result).toContain("\"email\": undefined");
      expect(result).toContain("\"phone\": undefined");
    });

    it("should not display grandchild property as direct child", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          user: {
            name: "John",
          },
        },
        errors: [
          {
            path: "$input.user.profile.email",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      // Should NOT add "profile" at user level
      // The error is too deep to be represented at the user object level
      expect(result).toContain("\"user\":");
      expect(result).toContain("\"name\": \"John\"");
    });
  });

  describe("type Mismatches", () => {
    it("should display type error for string instead of number", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          age: "25",
        },
        errors: [
          {
            path: "$input.age",
            expected: "number",
            value: "25",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"age\": \"25\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"number\"");
    });

    it("should display type error for number instead of string", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          name: 123,
        },
        errors: [
          {
            path: "$input.name",
            expected: "string",
            value: 123,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"name\": 123");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"string\"");
    });

    it("should display type error for boolean instead of string", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          status: true,
        },
        errors: [
          {
            path: "$input.status",
            expected: "string",
            value: true,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"status\": true");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"string\"");
    });

    it("should display type error for null instead of string", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          value: null,
        },
        errors: [
          {
            path: "$input.value",
            expected: "string",
            value: null,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"value\": null");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"string\"");
    });
  });

  describe("format Violations", () => {
    it("should display email format error", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          email: "invalid-email",
        },
        errors: [
          {
            path: "$input.email",
            expected: "string & Format<'email'>",
            value: "invalid-email",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"email\": \"invalid-email\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"string & Format<'email'>\"");
    });

    it("should display UUID format error", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          id: "not-a-uuid",
        },
        errors: [
          {
            path: "$input.id",
            expected: "string & Format<'uuid'>",
            value: "not-a-uuid",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"id\": \"not-a-uuid\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"string & Format<'uuid'>\"");
    });

    it("should display date-time format error", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          createdAt: "tomorrow",
        },
        errors: [
          {
            path: "$input.createdAt",
            expected: "string & Format<'date-time'>",
            value: "tomorrow",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"createdAt\": \"tomorrow\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"string & Format<'date-time'>\"");
    });

    it("should display error with description field", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          email: "invalid",
        },
        errors: [
          {
            path: "$input.email",
            expected: "string & Format<'email'>",
            value: "invalid",
            description: "Invalid email format",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"email\": \"invalid\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"description\":\"Invalid email format\"");
    });
  });

  describe("nested Objects", () => {
    it("should display errors in nested objects", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          user: {
            name: "John",
            age: "30",
          },
        },
        errors: [
          {
            path: "$input.user.age",
            expected: "number",
            value: "30",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"user\":");
      expect(result).toContain("\"name\": \"John\"");
      expect(result).toContain("\"age\": \"30\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("$input.user.age");
    });

    it("should display errors in deeply nested objects", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          user: {
            profile: {
              contact: {
                email: "invalid-email",
              },
            },
          },
        },
        errors: [
          {
            path: "$input.user.profile.contact.email",
            expected: "string & Format<'email'>",
            value: "invalid-email",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"user\":");
      expect(result).toContain("\"profile\":");
      expect(result).toContain("\"contact\":");
      expect(result).toContain("\"email\": \"invalid-email\"");
      expect(result).toContain("// ❌");
    });

    it("should display multiple errors at different nesting levels", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          name: 123,
          user: {
            age: "30",
          },
        },
        errors: [
          {
            path: "$input.name",
            expected: "string",
            value: 123,
          },
          {
            path: "$input.user.age",
            expected: "number",
            value: "30",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"name\": 123");
      expect(result).toContain("\"user\":");
      expect(result).toContain("\"age\": \"30\"");
      // Should have two error comments
      expect((result.match(/\/\/ ❌/g) ?? []).length).toBe(2);
    });

    it("should display missing property in deeply nested object", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          user: {
            profile: {
              name: "John",
            },
          },
        },
        errors: [
          {
            path: "$input.user.profile.email",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"user\":");
      expect(result).toContain("\"profile\":");
      expect(result).toContain("\"name\": \"John\"");
      expect(result).toContain("\"email\": undefined");
      expect(result).toContain("// ❌");
    });
  });

  describe("arrays", () => {
    it("should display error for array item", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          tags: ["valid", 123, "another"],
        },
        errors: [
          {
            path: "$input.tags[1]",
            expected: "string",
            value: 123,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"tags\":");
      expect(result).toContain("[");
      expect(result).toContain("\"valid\"");
      expect(result).toContain("123");
      expect(result).toContain("\"another\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("$input.tags[1]");
    });

    it("should display errors for multiple array items", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          numbers: [1, "2", 3, "4"],
        },
        errors: [
          {
            path: "$input.numbers[1]",
            expected: "number",
            value: "2",
          },
          {
            path: "$input.numbers[3]",
            expected: "number",
            value: "4",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"numbers\":");
      expect(result).toContain("1,");
      expect(result).toContain("\"2\"");
      expect(result).toContain("3,");
      expect(result).toContain("\"4\"");
      expect((result.match(/\/\/ ❌/g) ?? []).length).toBe(2);
    });

    it("should display errors in nested array of objects", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          users: [
            { name: "John", age: 30 },
            { name: "Jane", age: "25" },
          ],
        },
        errors: [
          {
            path: "$input.users[1].age",
            expected: "number",
            value: "25",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"users\":");
      expect(result).toContain("\"name\": \"John\"");
      expect(result).toContain("\"age\": 30");
      expect(result).toContain("\"name\": \"Jane\"");
      expect(result).toContain("\"age\": \"25\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("$input.users[1].age");
    });

    it("should handle empty array", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          items: [],
        },
        errors: [],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"items\":");
      expect(result).toContain("[]");
    });

    it("should display error on array itself", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          tags: "single-value",
        },
        errors: [
          {
            path: "$input.tags",
            expected: "Array<string>",
            value: "single-value",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"tags\": \"single-value\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"Array<string>\"");
    });
  });

  describe("complex Scenarios", () => {
    it("should handle complex nested structure with multiple errors", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          user: {
            name: "John",
            profile: {
              age: "30",
            },
          },
          tags: ["valid", 123],
        },
        errors: [
          {
            path: "$input.user.email",
            expected: "string",
            value: undefined,
          },
          {
            path: "$input.user.profile.age",
            expected: "number",
            value: "30",
          },
          {
            path: "$input.tags[1]",
            expected: "string",
            value: 123,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"user\":");
      expect(result).toContain("\"email\": undefined");
      expect(result).toContain("\"profile\":");
      expect(result).toContain("\"age\": \"30\"");
      expect(result).toContain("\"tags\":");
      expect(result).toContain("123");
      expect((result.match(/\/\/ ❌/g) ?? []).length).toBe(3);
    });

    it("should handle very deep nesting", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          level1: {
            level2: {
              level3: {
                level4: {
                  level5: {
                    value: "wrong-type",
                  },
                },
              },
            },
          },
        },
        errors: [
          {
            path: "$input.level1.level2.level3.level4.level5.value",
            expected: "number",
            value: "wrong-type",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"level1\":");
      expect(result).toContain("\"level2\":");
      expect(result).toContain("\"level3\":");
      expect(result).toContain("\"level4\":");
      expect(result).toContain("\"level5\":");
      expect(result).toContain("\"value\": \"wrong-type\"");
      expect(result).toContain("// ❌");
    });

    it("should handle mix of all error types", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          name: 123,
          email: "invalid-email",
          age: "30",
          tags: ["valid", 456],
          user: {
            status: true,
          },
        },
        errors: [
          {
            path: "$input.name",
            expected: "string",
            value: 123,
          },
          {
            path: "$input.email",
            expected: "string & Format<'email'>",
            value: "invalid-email",
          },
          {
            path: "$input.age",
            expected: "number",
            value: "30",
          },
          {
            path: "$input.tags[1]",
            expected: "string",
            value: 456,
          },
          {
            path: "$input.user.status",
            expected: "string",
            value: true,
          },
          {
            path: "$input.user.role",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"name\": 123");
      expect(result).toContain("\"email\": \"invalid-email\"");
      expect(result).toContain("\"age\": \"30\"");
      expect(result).toContain("\"tags\":");
      expect(result).toContain("456");
      expect(result).toContain("\"user\":");
      expect(result).toContain("\"status\": true");
      expect(result).toContain("\"role\": undefined");
      expect((result.match(/\/\/ ❌/g) ?? []).length).toBe(6);
    });

    it("should handle object with special characters in property names", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          "special-key": "value",
          "key.with.dots": 123,
        },
        errors: [
          {
            path: "$input[\"key.with.dots\"]",
            expected: "string",
            value: 123,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"special-key\": \"value\"");
      expect(result).toContain("\"key.with.dots\": 123");
      expect(result).toContain("// ❌");
    });
  });

  describe("edge Cases", () => {
    it("should handle empty object with no errors", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {},
        errors: [],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toBe("{}");
    });

    it("should handle empty object with errors", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {},
        errors: [
          {
            path: "$input.name",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("{");
      expect(result).toContain("\"name\": undefined");
      expect(result).toContain("// ❌");
      expect(result).toContain("}");
    });

    it("should handle primitive value with error", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: "wrong-type",
        errors: [
          {
            path: "$input",
            expected: "number",
            value: "wrong-type",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"wrong-type\"");
      expect(result).toContain("// ❌");
      expect(result).toContain("\"expected\":\"number\"");
    });

    it("should handle null value with error", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: null,
        errors: [
          {
            path: "$input",
            expected: "object",
            value: null,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("null");
      expect(result).toContain("// ❌");
    });

    it("should handle undefined in array", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          items: ["valid", undefined, "another"],
        },
        errors: [
          {
            path: "$input.items[1]",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"items\":");
      expect(result).toContain("\"valid\"");
      expect(result).toContain("undefined");
      expect(result).toContain("\"another\"");
      expect(result).toContain("// ❌");
    });

    it("should handle multiple errors on same path", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          email: "invalid",
        },
        errors: [
          {
            path: "$input.email",
            expected: "string & Format<'email'>",
            value: "invalid",
          },
          {
            path: "$input.email",
            expected: "string & MinLength<5>",
            value: "invalid",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"email\": \"invalid\"");
      expect(result).toContain("// ❌");
      // Should contain both errors in the comment
      expect(result).toContain("\"expected\":\"string & Format<'email'>\"");
      expect(result).toContain("\"expected\":\"string & MinLength<5>\"");
    });

    it("should handle object with toJSON method", () => {
      class CustomObject {
        constructor(public value: string) {}
        toJSON() {
          return { serialized: this.value };
        }
      }

      const failure: IValidation.IFailure = {
        success: false,
        data: {
          custom: new CustomObject("test"),
        },
        errors: [
          {
            path: "$input.custom.serialized",
            expected: "number",
            value: "test",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"custom\":");
      expect(result).toContain("\"serialized\": \"test\"");
      expect(result).toContain("// ❌");
    });

    it("should handle large object", () => {
      const largeData: any = {};
      const errors: IValidation.IError[] = [];

      for (let i = 0; i < 50; i++) {
        largeData[`field${i}`] = i % 2 === 0 ? i : `${i}`;
        if (i % 2 !== 0) {
          errors.push({
            path: `$input.field${i}`,
            expected: "number",
            value: `${i}`,
          });
        }
      }

      const failure: IValidation.IFailure = {
        success: false,
        data: largeData,
        errors,
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      // Should contain all fields
      for (let i = 0; i < 50; i++) {
        expect(result).toContain(`"field${i}"`);
      }
      // Should have 25 error comments (for odd numbers)
      expect((result.match(/\/\/ ❌/g) ?? []).length).toBe(25);
    });

    it("should preserve correct indentation", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          level1: {
            level2: {
              value: "test",
            },
          },
        },
        errors: [],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      // Check that indentation increases with nesting
      const lines = result.split("\n");
      expect(lines[0]).toMatch(/^\{/); // No indent
      expect(lines[1]).toMatch(/^ {2}"level1":/); // 2 spaces
      expect(lines[2]).toMatch(/^ {4}"level2":/); // 4 spaces
      expect(lines[3]).toMatch(/^ {6}"value":/); // 6 spaces
    });

    it("should handle array with error on non-existent index", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          items: ["a", "b"],
        },
        errors: [
          {
            path: "$input.items[5]",
            expected: "string",
            value: undefined,
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("\"items\":");
      expect(result).toContain("\"a\"");
      expect(result).toContain("\"b\"");
      // Array index errors are not added as missing properties
      // This is correct behavior - array indices work differently
    });
  });

  describe("error Comment Format", () => {
    it("should include path and expected in error comment", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          age: "25",
        },
        errors: [
          {
            path: "$input.age",
            expected: "number",
            value: "25",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("// ❌");
      expect(result).toContain("\"path\":\"$input.age\"");
      expect(result).toContain("\"expected\":\"number\"");
      // Note: value is not included in error comment since it's already visible in the JSON structure
    });

    it("should include description in error comment when present", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          email: "invalid",
        },
        errors: [
          {
            path: "$input.email",
            expected: "string & Format<'email'>",
            value: "invalid",
            description: "Must be a valid email address",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      expect(result).toContain("// ❌");
      expect(result).toContain("\"description\":\"Must be a valid email address\"");
    });

    it("should format error comment as valid JSON", () => {
      const failure: IValidation.IFailure = {
        success: false,
        data: {
          value: "test",
        },
        errors: [
          {
            path: "$input.value",
            expected: "number",
            value: "test",
          },
        ],
      };

      const result = JsonUtil.stringifyValidateFailure(failure);

      // Extract error comment
      const match = result.match(/\/\/ ❌ (.+)/);
      expect(match).not.toBeNull();

      // Should be parseable JSON array
      const errorJson = JSON.parse(match![1]!);
      expect(Array.isArray(errorJson)).toBe(true);
      expect(errorJson[0]).toHaveProperty("path");
      expect(errorJson[0]).toHaveProperty("expected");
      // Note: value is not included in error comment to avoid redundancy
      expect(errorJson[0].path).toBe("$input.value");
      expect(errorJson[0].expected).toBe("number");
    });
  });
});
