import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { IAgenticaExecutor } from "../structures/IAgenticaExecutor";

import { call } from "./call";
import { cancel } from "./cancel";
import { describe } from "./describe";
import { initialize } from "./initialize";
import { select } from "./select";

export function execute<Model extends ILlmSchema.Model>(executor: Partial<IAgenticaExecutor<Model>> | null) {
  return async (ctx: AgenticaContext<Model>): Promise<AgenticaHistory<Model>[]> => {
    const histories: AgenticaHistory<Model>[] = [];

    // FUNCTIONS ARE NOT LISTED YET
    if (ctx.ready() === false) {
      if (executor?.initialize !== true && typeof executor?.initialize !== "function") {
        await ctx.initialize();
      }
      else {
        histories.push(
          ...(await (
            typeof executor?.initialize === "function"
              ? executor.initialize
              : initialize
          )(ctx)),
        );
        if (ctx.ready() === false) {
          return histories;
        }
      }
    }

    // CANCEL CANDIDATE FUNCTIONS
    if (ctx.stack.length !== 0) {
      histories.push(
        ...(await (executor?.cancel ?? cancel)(
          ctx,
        )),
      );
    }

    // SELECT CANDIDATE FUNCTIONS
    histories.push(
      ...(await (executor?.select ?? select)(
        ctx,
      )),
    );
    if (ctx.stack.length === 0) {
      return histories;
    }

    // FUNCTION CALLING LOOP
    while (true) {
      // EXECUTE FUNCTIONS
      const prompts: AgenticaHistory<Model>[] = await (
        executor?.call ?? call
      )(ctx, ctx.stack.map(s => s.operation));
      histories.push(...prompts);

      // EXPLAIN RETURN VALUES
      const executes: AgenticaExecuteHistory<Model>[] = prompts.filter(
        prompt => prompt.type === "execute",
      );
      if (executor?.describe !== null && executor?.describe !== false) {
        histories.push(
          ...(await (
            typeof executor?.describe === "function"
              ? executor.describe
              : describe
          )(ctx, executes)),
        );
      }
      if (executes.length === 0 || ctx.stack.length === 0) {
        break;
      }
    }
    return histories;
  };
}
