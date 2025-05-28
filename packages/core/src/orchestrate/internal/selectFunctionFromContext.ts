import type { ILlmSchema } from "@samchon/openapi";

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
export function selectFunctionFromContext<
  Model extends ILlmSchema.Model,
>(
  ctx: AgenticaContext<Model>,
  reference: __IChatFunctionReference,
): void {
  const operation: AgenticaOperation<Model> | undefined
      = ctx.operations.flat.get(reference.name);
  if (operation === undefined) {
    return;
  }

  const selection: AgenticaOperationSelection<Model>
    = createOperationSelection({
      operation,
      reason: reference.reason,
    });
  const event: AgenticaSelectEvent<Model> = createSelectEvent({
    selection,
  });
  ctx.dispatch(event);
}
