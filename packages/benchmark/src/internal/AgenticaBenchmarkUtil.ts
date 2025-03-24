/**
 * @module
 * This file contains functions to work with AgenticaBenchmarkUtil.
 *
 * @author Wrtn Technologies
 */
import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaBenchmarkExpected } from "../structures/IAgenticaBenchmarkExpected";

export const AgenticaBenchmarkUtil = {
  errorToJson,
  expectedToJson,
};

function errorToJson<T>(error: T): T | ({
  [k in keyof T]: T[k]
} & {
  name: string;
  message: string;
  stack: string;
}) {
  if (error instanceof Error) {
    return {
      ...error,
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }
  return error;
}

function expectedToJson<Model extends ILlmSchema.Model>(expected: IAgenticaBenchmarkExpected<Model>): any {
  if (expected.type === "standalone") {
    return {
      type: expected.type,
      operation: {
        name: expected.operation.name,
        description: expected.operation.function.description,
      },
    };
  }
  else if (expected.type === "array") {
    return {
      type: expected.type,
      items: expected.items.map(expectedToJson),
    };
  }
  else if (expected.type === "allOf") {
    return {
      type: expected.type,
      allOf: expected.allOf.map(expectedToJson),
    };
  }
  else {
    return {
      type: expected.type,
      anyOf: expected.anyOf.map(expectedToJson),
    };
  }
}
