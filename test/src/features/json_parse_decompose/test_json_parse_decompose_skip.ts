import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

export function test_json_parse_decompose_skip(): void {
  test_skip_string_schema();
  test_skip_anyOf_with_string();
}

// 스키마가 string 타입이면 decompose 안함
function test_skip_string_schema(): void {
  interface IInput {
    data: string;
  }

  const parameters = typia.llm.parameters<IInput>();

  const input = JSON.stringify({ data: "{\"foo\":\"bar\"}" });
  const result = JsonUtil.parse(input, parameters);

  // string 스키마이므로 decompose 안함
  TestValidator.equals("skip_string")(result.data)("{\"foo\":\"bar\"}");
}

// anyOf에 string이 포함되면 decompose 안함
function test_skip_anyOf_with_string(): void {
  interface IInput {
    data: { x: number } | string;
  }

  const parameters = typia.llm.parameters<IInput>();

  const input = JSON.stringify({ data: "{\"x\":1}" });
  const result = JsonUtil.parse(input, parameters);

  // anyOf에 string 포함되므로 decompose 안함
  TestValidator.equals("skip_anyOf_string")(result.data)("{\"x\":1}");
}
