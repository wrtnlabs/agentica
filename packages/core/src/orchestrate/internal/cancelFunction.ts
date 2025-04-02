import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "../../context/AgenticaContext";
import type { AgenticaOperationSelection } from "../../context/AgenticaOperationSelection";
import type { __IChatFunctionReference } from "../../context/internal/__IChatFunctionReference";

import { createCancelEvent } from "../../factory/events";
import { createOperationSelection } from "../../factory/operations";

/**
 * @internal
 */
export async function cancelFunction<Model extends ILlmSchema.Model>(
  ctx: AgenticaContext<Model>,
  reference: __IChatFunctionReference,
): Promise<AgenticaOperationSelection<Model> | null> {
  const index: number = ctx.stack.findIndex(
    item => item.operation.name === reference.name,
  );
  if (index === -1) {
    return null;
  }

  const item: AgenticaOperationSelection<Model> = ctx.stack[index]!;
  ctx.stack.splice(index, 1);
  await ctx.dispatch(
    createCancelEvent({
      selection: createOperationSelection({
        operation: item.operation,
        reason: reference.reason,
      }),
    }),
  );
  return item;
}
