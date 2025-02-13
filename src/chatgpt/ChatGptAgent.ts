import { IWrtnAgentContext } from "../structures/IWrtnAgentContext";
import { IWrtnAgentPrompt } from "../structures/IWrtnAgentPrompt";
import { ChatGptCancelFunctionAgent } from "./ChatGptCancelFunctionAgent";
import { ChatGptDescribeFunctionAgent } from "./ChatGptDescribeFunctionAgent";
import { ChatGptExecuteFunctionAgent } from "./ChatGptExecuteFunctionAgent";
import { ChatGptInitializeFunctionAgent } from "./ChatGptInitializeFunctionAgent";
import { ChatGptSelectFunctionAgent } from "./ChatGptSelectFunctionAgent";

export namespace ChatGptAgent {
  export const execute = async (
    ctx: IWrtnAgentContext,
  ): Promise<IWrtnAgentPrompt[]> => {
    const histories: IWrtnAgentPrompt[] = [];

    // FUNCTIONS ARE NOT LISTED YET
    if (ctx.ready() === false) {
      histories.push(...(await ChatGptInitializeFunctionAgent.execute(ctx)));
      if (ctx.ready() === false) return histories;
    }

    // CANCEL CANDIDATE FUNCTIONS
    if (ctx.stack.length !== 0)
      histories.push(...(await ChatGptCancelFunctionAgent.execute(ctx)));

    // SELECT CANDIDATE FUNCTIONS
    histories.push(...(await ChatGptSelectFunctionAgent.execute(ctx)));
    if (ctx.stack.length === 0) return histories;

    // FUNCTION CALLING LOOP
    while (true) {
      // EXECUTE FUNCTIONS
      const prompts: IWrtnAgentPrompt[] =
        await ChatGptExecuteFunctionAgent.execute(ctx);
      histories.push(...prompts);

      // EXPLAIN RETURN VALUES
      const executes: IWrtnAgentPrompt.IExecute[] = prompts.filter(
        (prompt) => prompt.type === "execute",
      );
      for (const e of executes)
        await ChatGptCancelFunctionAgent.cancelFunction(ctx, {
          reason: "completed",
          name: e.function.name,
        });
      histories.push(
        ...(await ChatGptDescribeFunctionAgent.execute(ctx, executes)),
      );
      if (executes.length === 0 || ctx.stack.length === 0) break;
    }
    return histories;
  };
}
