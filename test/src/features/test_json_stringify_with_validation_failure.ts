import type { IValidation } from "typia";

import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";
import { TestValidator } from "@nestia/e2e";

export function test_json_stringify_with_validation_failure(): void {
  const failure: IValidation.IFailure = {
    success: false,
    data: {
      operations: [],
    },
    errors: [
      {
        path: "$input.operations",
        expected: "non-empty array",
        value: [],
      },
      {
        path: "$input.operations",
        expected: "array of objects with 'id' as number",
        value: [],
      },
      {
        path: "$input.operations[].id",
        expected: "something",
        value: [],
      },
    ],
  };
  const str: string = JsonUtil.stringifyValidationFailure(failure);
  TestValidator.predicate("regular")(str.includes(
    JSON.stringify([
      {
        path: "$input.operations",
        expected: "non-empty array",
      },
      {
        path: "$input.operations",
        expected: "array of objects with 'id' as number",
      },
    ]),
  ));
  TestValidator.predicate("unmappable")(str.includes(
    JSON.stringify([{
      path: "$input.operations[].id",
      expected: "something",
      value: [],
    }], null, 2),
  ));
}
