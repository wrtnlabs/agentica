import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";
import typia from "typia";

interface IUser {
  id: number;
  name: string;
}

interface IInput {
  user: IUser;
}

export function test_json_parse_decompose_ref(): void {
  const parameters = typia.llm.parameters<IInput>();

  // LLM이 $ref로 정의된 object를 문자열로 반환한 경우
  const input = JSON.stringify({ user: "{\"id\":123,\"name\":\"John\"}" });
  const result = JsonUtil.parse(input, parameters);

  TestValidator.equals("decompose_ref")(result.user)({ id: 123, name: "John" });
}
