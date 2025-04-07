import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "../../context/AgenticaContext";
import type { AgenticaOperation } from "../../context/AgenticaOperation";
import type { AgenticaOperationSelection } from "../../context/AgenticaOperationSelection";
import type { __IChatFunctionReference } from "../../context/internal/__IChatFunctionReference";

import { createSelectEvent } from "../../factory/events";
import { createOperationSelection } from "../../factory/operations";

/**
 * @internal
 */
export async function selectFunction<Model extends ILlmSchema.Model>(ctx: AgenticaContext<Model>, reference: __IChatFunctionReference): Promise<AgenticaOperation<Model> | null> {
  const operation: AgenticaOperation<Model> | undefined
      = ctx.operations.flat.get(reference.name);
  if (operation === undefined) {
    return null;
  }

  const selection: AgenticaOperationSelection<Model>
      = createOperationSelection({
        operation,
        reason: reference.reason,
      });
  ctx.stack.push(selection);
  void ctx.dispatch(
    createSelectEvent({
      selection,
    }),
  );
  return operation;
}
