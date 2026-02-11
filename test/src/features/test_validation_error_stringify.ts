import type { IValidation } from "typia";

import { JsonUtil } from "@agentica/core/src/utils/JsonUtil";

export function test_validate_error_stringify(): void {
  const failure: IValidation.IFailure = {
    success: false,
    data: {},
    errors: [
      {
        path: "$input.x",
        expected: "number",
        value: undefined,
      },
    ],
  };
  const str: string = JsonUtil.stringifyValidationFailure(failure);
  console.log(str);
};
