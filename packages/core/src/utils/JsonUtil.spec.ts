import { JsonUtil } from "./JsonUtil";

describe("JsonUtil", () => {
  describe("parse", () => {
    it("should handle string that starts with '{}'", () => {
      const jsonString = '{}{"name": "test", "value": 42}';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({ name: "test", value: 42 });
    });

    it("should handle array with '{}' prefix", () => {
      const jsonString = '{}[1, 2, 3, "test"]';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual([1, 2, 3, "test"]);
    });

    it("should handle nested object with '{}' prefix", () => {
      const jsonString = '{}{"user": {"id": 1, "name": "John"}}';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({
        user: { id: 1, name: "John" }
      });
    });

    it("should handle primitive values with '{}' prefix", () => {
      expect(JsonUtil.parse('{}42')).toBe(42);
      expect(JsonUtil.parse('{}"hello"')).toBe("hello");
      expect(JsonUtil.parse('{}true')).toBe(true);
      expect(JsonUtil.parse('{}null')).toBeNull();
    });

    it("should not modify string that doesn't start with '{}'", () => {
      const jsonString = '{"normal": "json"}';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({ normal: "json" });
    });

    // 마지막 괄호 누락 보정 테스트 (예상 기능)
    it("should handle missing closing brace in object", () => {
      const jsonString = '{"name": "test", "value": 42';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({ name: "test", value: 42 });
    });

    it("should handle missing closing bracket in array", () => {
      const jsonString = '[1, 2, 3, "test"';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual([1, 2, 3, "test"]);
    });

    it("should handle nested object with missing closing brace", () => {
      const jsonString = '{"user": {"id": 1, "name": "John"}';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({
        user: { id: 1, name: "John" }
      });
    });

    it("should handle complex nested structure with missing closing brace", () => {
      const jsonString = '{"users": [{"id": 1, "name": "John"}, {"id": 2, "name": "Jane"}], "count": 2';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({
        users: [
          { id: 1, name: "John" },
          { id: 2, name: "Jane" }
        ],
        count: 2
      });
    });

    it("should handle both '{}' prefix and missing closing brace", () => {
      const jsonString = '{}{"name": "test", "value": 42';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual({ name: "test", value: 42 });
    });

    it("should handle both '{}' prefix and missing closing bracket in array", () => {
      const jsonString = '{}[1, 2, 3, "test"';
      const result = JsonUtil.parse(jsonString);
      
      expect(result).toEqual([1, 2, 3, "test"]);
    });

    // 에러 케이스 (보정할 수 없는 경우)
    it("should throw error for completely invalid JSON", () => {
      const invalidJson = '{invalid: json without quotes}';
      
      expect(() => JsonUtil.parse(invalidJson)).toThrow();
    });

    it("should throw error for empty string", () => {
      expect(() => JsonUtil.parse("")).toThrow();
    });
  });
});
