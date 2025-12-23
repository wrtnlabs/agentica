import type { AgenticaContext } from "../../context/AgenticaContext";
import type { AgenticaOperation } from "../../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../../context/AgenticaOperationSelection";
import type { __IChatFunctionReference } from "../../context/internal/__IChatFunctionReference";
import type { AgenticaSelectEvent } from "../../events/AgenticaSelectEvent";

import { createSelectEvent } from "../../factory/events";
import { createOperationSelection } from "../../factory/operations";

/**
 * @internal
 */
export function selectFunctionFromContext(
  ctx: AgenticaContext,
  reference: __IChatFunctionReference,
): void {
  const operation: AgenticaOperation | undefined
    = ctx.operations.flat.get(reference.name);
  if (operation === undefined) {
    return;
  }

  const selection: AgenticaOperationSelection
    = createOperationSelection({
      operation,
      reason: reference.reason,
    });
  ctx.stack.push(selection);

  const event: AgenticaSelectEvent = createSelectEvent({
    selection,
  });
  void ctx.dispatch(event).catch(() => {});
}
