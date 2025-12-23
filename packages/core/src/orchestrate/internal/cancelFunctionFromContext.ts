import type { AgenticaContext } from "../../context/AgenticaContext";
import type { AgenticaOperationSelection } from "../../context/AgenticaOperationSelection";
import type { __IChatFunctionReference } from "../../context/internal/__IChatFunctionReference";
import type { AgenticaCancelEvent } from "../../events";

import { createCancelEvent } from "../../factory/events";
import { createOperationSelection } from "../../factory/operations";

/**
 * @internal
 */
export function cancelFunctionFromContext(
  ctx: AgenticaContext,
  reference: __IChatFunctionReference,
): void {
  const index: number = ctx.stack.findIndex(
    item => item.operation.name === reference.name,
  );
  if (index === -1) {
    return;
  }

  const item: AgenticaOperationSelection = ctx.stack[index]!;
  ctx.stack.splice(index, 1);

  const event: AgenticaCancelEvent = createCancelEvent({
    selection: createOperationSelection({
      operation: item.operation,
      reason: reference.reason,
    }),
  });
  void ctx.dispatch(event).catch(() => {});
}
