import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

export function test_json_parse_decompose_object(): void {
  interface IInput {
    data: {
      foo: string;
      bar: number;
    };
  }

  const parameters = typia.llm.parameters<IInput>();

  // LLM이 object를 문자열로 반환한 경우
  const input = JSON.stringify({ data: "{\"foo\":\"hello\",\"bar\":42}" });
  const result = JsonUtil.parse(input, parameters);

  TestValidator.equals("decompose_object")(result.data)({ foo: "hello", bar: 42 });
}
