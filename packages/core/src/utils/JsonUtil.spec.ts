import { JsonUtil } from "./JsonUtil";

describe("jsonUtil", () => {
  describe("parse", () => {
    describe("normal Operations", () => {
      it("should parse standard valid JSON", () => {
        const jsonString = "{\"normal\": \"json\"}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({ normal: "json" });
      });

      it("should handle object with '{}' prefix", () => {
        const jsonString = "{}{\"name\": \"test\", \"value\": 42}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({ name: "test", value: 42 });
      });

      it("should handle array with '{}' prefix", () => {
        const jsonString = "{}[1, 2, 3, \"test\"]";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual([1, 2, 3, "test"]);
      });

      it("should handle primitive values with '{}' prefix", () => {
        expect(JsonUtil.parse("{}42")).toBe(42);
        expect(JsonUtil.parse("{}\"hello\"")).toBe("hello");
        expect(JsonUtil.parse("{}true")).toBe(true);
        expect(JsonUtil.parse("{}null")).toBeNull();
      });

      it("should remove trailing comma in object", () => {
        const jsonString = "{\"name\": \"test\", \"value\": 42,}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({ name: "test", value: 42 });
      });

      it("should remove trailing comma in array", () => {
        const jsonString = "[1, 2, 3, \"test\",]";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual([1, 2, 3, "test"]);
      });

      it("should add missing closing brace in object", () => {
        const jsonString = "{\"name\": \"test\", \"value\": 42";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({ name: "test", value: 42 });
      });

      it("should add missing closing bracket in array", () => {
        const jsonString = "[1, 2, 3, \"test\"";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual([1, 2, 3, "test"]);
      });
    });

    describe("combined Features", () => {
      it("should handle '{}' prefix and missing closing brace together", () => {
        const jsonString = "{}{\"name\": \"test\", \"value\": 42";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({ name: "test", value: 42 });
      });

      it("should handle '{}' prefix and missing closing bracket together", () => {
        const jsonString = "{}[1, 2, 3, \"test\"";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual([1, 2, 3, "test"]);
      });

      it("should handle trailing comma in nested objects", () => {
        const jsonString = "{\"user\": {\"id\": 1, \"name\": \"John\",}, \"active\": true,}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          user: { id: 1, name: "John" },
          active: true,
        });
      });

      it("should handle missing closing brace in nested objects", () => {
        const jsonString = "{\"user\": {\"id\": 1, \"name\": \"John\"}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          user: { id: 1, name: "John" },
        });
      });

      it("should handle missing closing brace in complex nested structure", () => {
        const jsonString = "{\"users\": [{\"id\": 1, \"name\": \"John\"}, {\"id\": 2, \"name\": \"Jane\"}], \"count\": 2";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          users: [
            { id: 1, name: "John" },
            { id: 2, name: "Jane" },
          ],
          count: 2,
        });
      });

      it("should apply all correction features together", () => {
        const jsonString = "{}{\"name\": \"test\", \"items\": [1, 2, 3,], \"user\": {\"id\": 1, \"name\": \"John\",}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          name: "test",
          items: [1, 2, 3],
          user: { id: 1, name: "John" },
        });
      });

      it("should handle all issues simultaneously in complex nested structure", () => {
        const jsonString = "{}{\"data\": {\"users\": [{\"id\": 1, \"name\": \"John\",}, {\"id\": 2, \"name\": \"Jane\",}], \"meta\": {\"total\": 2, \"page\": 1,}}, \"status\": \"ok\",";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          data: {
            users: [
              { id: 1, name: "John" },
              { id: 2, name: "Jane" },
            ],
            meta: { total: 2, page: 1 },
          },
          status: "ok",
        });
      });
    });

    describe("edge Cases", () => {
      it("should handle empty object with '{}' prefix", () => {
        const jsonString = "{}{}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({});
      });

      it("should handle empty array with '{}' prefix", () => {
        const jsonString = "{}[]";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual([]);
      });

      it("should handle nested object with '{}' prefix", () => {
        const jsonString = "{}{\"user\": {\"id\": 1, \"name\": \"John\"}}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          user: { id: 1, name: "John" },
        });
      });

      it("should handle multiple trailing commas", () => {
        const jsonString = "{\"items\": [1, 2, 3,,,], \"count\": 3,,,}";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({
          items: [1, 2, 3],
          count: 3,
        });
      });

      it("should handle JSON with whitespace and formatting issues", () => {
        const jsonString = "{} { \"name\" : \"test\" , \"value\" : 42 , } ";
        const result = JsonUtil.parse(jsonString);

        expect(result).toEqual({ name: "test", value: 42 });
      });

      it("should throw error for completely invalid JSON", () => {
        const invalidJson = "{invalid: json without quotes}";

        expect(() => JsonUtil.parse(invalidJson)).toThrow();
      });

      it("should throw error for empty string", () => {
        expect(() => JsonUtil.parse("")).toThrow();
      });
    });
  });
});
