import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

export function test_json_parse_decompose_multiple(): void {
  interface IInput {
    data1: { a: number };
    data2: { b: number };
  }

  const parameters = typia.llm.parameters<IInput>();

  // LLM이 2개 이상의 프로퍼티를 각각 문자열로 반환한 경우
  const input = JSON.stringify({
    data1: "{\"a\":1}",
    data2: "{\"b\":2}",
  });
  const result = JsonUtil.parse(input, parameters);

  // 이제 모든 프로퍼티에 대해 decompose 수행
  TestValidator.equals("decompose_multi_data1")(result.data1)({ a: 1 });
  TestValidator.equals("decompose_multi_data2")(result.data2)({ b: 2 });
}
