import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

export function test_json_parse_decompose_double(): void {
  test_double_stringified_root();
  test_double_stringified_root_with_object_property();
}

// LLM이 전체 JSON을 문자열로 한 번 더 감싼 경우
function test_double_stringified_root(): void {
  interface IInput {
    name: string;
    age: number;
  }

  const parameters = typia.llm.parameters<IInput>();

  // LLM이 '{"name":"John","age":30}' 문자열로 반환 (따옴표 안에 JSON)
  const input = JSON.stringify(JSON.stringify({ name: "John", age: 30 }));
  const result = JsonUtil.parse(input, parameters);

  TestValidator.equals("double_root_name")(result.name)("John");
  TestValidator.equals("double_root_age")(result.age)(30);
}

// root가 double stringified + property도 stringified인 경우
function test_double_stringified_root_with_object_property(): void {
  interface IInput {
    data: {
      x: number;
    };
  }

  const parameters = typia.llm.parameters<IInput>();

  // LLM이 전체를 문자열로 감싸고, 내부 data도 문자열로 감쌈
  const innerData = JSON.stringify({ x: 42 });
  const root = JSON.stringify({ data: innerData });
  const input = JSON.stringify(root); // double stringify

  const result = JsonUtil.parse(input, parameters);

  TestValidator.equals("double_nested")(result.data)({ x: 42 });
}
