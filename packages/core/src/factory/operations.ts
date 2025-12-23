import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";

export function createOperationSelection(props: {
  operation: AgenticaOperation;
  reason: string;
}): AgenticaOperationSelection {
  return {
    operation: props.operation,
    reason: props.reason,
    toJSON: () => ({
      operation: props.operation.toJSON(),
      reason: props.reason,
    }),
  };
}
