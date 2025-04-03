import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";

export function createOperationSelection<Model extends ILlmSchema.Model>(props: {
  operation: AgenticaOperation<Model>;
  reason: string;
}): AgenticaOperationSelection<Model> {
  return {
    operation: props.operation,
    reason: props.reason,
    toJSON: () => ({
      operation: props.operation.toJSON(),
      reason: props.reason,
    }),
  };
}
