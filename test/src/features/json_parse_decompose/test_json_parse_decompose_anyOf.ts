import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

export function test_json_parse_decompose_anyOf(): void {
  interface IInput {
    data: { x: number } | null;
  }

  const parameters = typia.llm.parameters<IInput>();

  // LLM이 anyOf [object, null] 타입을 문자열로 반환한 경우
  const input = JSON.stringify({ data: "{\"x\":10}" });
  const result = JsonUtil.parse(input, parameters);

  TestValidator.equals("decompose_anyOf")(result.data)({ x: 10 });
}
