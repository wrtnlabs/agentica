import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";
import type { IAgenticaExecutor } from "../structures/IAgenticaExecutor";
import { ChatGptCallFunctionAgent } from "./ChatGptCallFunctionAgent";
import { ChatGptCancelFunctionAgent } from "./ChatGptCancelFunctionAgent";
import { ChatGptDescribeFunctionAgent } from "./ChatGptDescribeFunctionAgent";
import { ChatGptInitializeFunctionAgent } from "./ChatGptInitializeFunctionAgent";
import { ChatGptSelectFunctionAgent } from "./ChatGptSelectFunctionAgent";

export const ChatGptAgent = {
  execute: <Model extends ILlmSchema.Model>(executor: Partial<IAgenticaExecutor<Model>> | null) => async (ctx: AgenticaContext<Model>): Promise<AgenticaPrompt<Model>[]> => {
    const histories: AgenticaPrompt<Model>[] = [];

    // FUNCTIONS ARE NOT LISTED YET
    if (ctx.ready() === false) {
      if (executor?.initialize === null) {
        await ctx.initialize();
      }
      else {
        histories.push(
          ...(await (
            executor?.initialize ?? ChatGptInitializeFunctionAgent.execute
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
        ...(await (executor?.cancel ?? ChatGptCancelFunctionAgent.execute)(
          ctx,
        )),
      );
    }

    // SELECT CANDIDATE FUNCTIONS
    histories.push(
      ...(await (executor?.select ?? ChatGptSelectFunctionAgent.execute)(
        ctx,
      )),
    );
    if (ctx.stack.length === 0) {
      return histories;
    }

    // FUNCTION CALLING LOOP
    while (true) {
      // EXECUTE FUNCTIONS
      const prompts: AgenticaPrompt<Model>[] = await (
        executor?.call ?? ChatGptCallFunctionAgent.execute
      )(ctx);
      histories.push(...prompts);

      // EXPLAIN RETURN VALUES
      const executes: AgenticaExecutePrompt<Model>[] = prompts.filter(
        prompt => prompt.type === "execute",
      );
      for (const e of executes) {
        await ChatGptCancelFunctionAgent.cancelFunction(ctx, {
          reason: "completed",
          name: e.operation.name,
        });
      }
      histories.push(
        ...(await (
          executor?.describe ?? ChatGptDescribeFunctionAgent.execute
        )(ctx, executes)),
      );
      if (executes.length === 0 || ctx.stack.length === 0) {
        break;
      }
    }
    return histories;
  },
};
