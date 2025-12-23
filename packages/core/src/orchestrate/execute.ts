import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaExecuteEvent } from "../events";
import type { IAgenticaExecutor } from "../structures/IAgenticaExecutor";

import { call } from "./call";
import { cancel } from "./cancel";
import { describe } from "./describe";
import { initialize } from "./initialize";
import { select } from "./select";

export function execute(executor: Partial<IAgenticaExecutor> | null) {
  return async (ctx: AgenticaContext): Promise<void> => {
    // FUNCTIONS ARE NOT LISTED YET
    if (ctx.ready() === false) {
      if (executor?.initialize !== true && typeof executor?.initialize !== "function") {
        await ctx.initialize();
      }
      else {
        await (
          typeof executor?.initialize === "function"
            ? executor.initialize
            : initialize
        )(ctx);
        if (ctx.ready() === false) {
          return;
        }
      }
    }

    // CANCEL CANDIDATE FUNCTIONS
    if (ctx.stack.length !== 0) {
      await (executor?.cancel ?? cancel)(ctx);
    }

    // SELECT CANDIDATE FUNCTIONS
    await (executor?.select ?? select)(ctx);
    if (ctx.stack.length === 0) {
      return;
    }

    // FUNCTION CALLING LOOP
    while (true) {
      // EXECUTE FUNCTIONS
      const executes: AgenticaExecuteEvent[] = await (
        executor?.call ?? call
      )(ctx, ctx.stack.map(s => s.operation));

      // EXPLAIN RETURN VALUES
      if (executor?.describe !== null && executor?.describe !== false) {
        await (
          typeof executor?.describe === "function"
            ? executor.describe
            : describe
        )(ctx, executes);
      }
      if (executes.length === 0 || ctx.stack.length === 0) {
        break;
      }
    }
  };
}
