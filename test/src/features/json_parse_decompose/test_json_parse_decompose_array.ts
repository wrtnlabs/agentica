import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

export function test_json_parse_decompose_array(): void {
  interface IInput {
    items: number[];
  }

  const parameters = typia.llm.parameters<IInput>();

  // LLM이 array를 문자열로 반환한 경우
  const input = JSON.stringify({ items: "[1,2,3]" });
  const result = JsonUtil.parse(input, parameters);

  TestValidator.equals("decompose_array")(result.items)([1, 2, 3]);
}
