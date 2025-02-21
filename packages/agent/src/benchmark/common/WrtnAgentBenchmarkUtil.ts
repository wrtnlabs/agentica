import { IWrtnAgentBenchmarkExpected } from "./IWrtnAgentBenchmarkExpected";

export namespace WrtnAgentBenchmarkUtil {
  export const errorToJson = (error: any): any => {
    if (error instanceof Error)
      return {
        ...error,
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    return error;
  };

  export const expectedToJson = (
    expected: IWrtnAgentBenchmarkExpected,
  ): any => {
    if (expected.type === "standalone")
      return {
        type: expected.type,
        operation: {
          name: expected.operation.name,
          description: expected.operation.function.description,
        },
      };
    else if (expected.type === "array")
      return {
        type: expected.type,
        items: expected.items.map(expectedToJson),
      };
    else if (expected.type === "allOf")
      return {
        type: expected.type,
        allOf: expected.allOf.map(expectedToJson),
      };
    else
      return {
        type: expected.type,
        anyOf: expected.anyOf.map(expectedToJson),
      };
  };
}
