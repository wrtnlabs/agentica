import { IWrtnAgentContext } from "../structures/IWrtnAgentContext";
import { IWrtnAgentPrompt } from "../structures/IWrtnAgentPrompt";

export namespace ChatGptAgent {
  export const execute = async (
    ctx: IWrtnAgentContext,
  ): Promise<IWrtnAgentPrompt[]> => {
    const histories: IWrtnAgentPrompt[] = [];

    async function runState(
      stateName: string,
      agentExecutedResult: IWrtnAgentPrompt[],
    ) {
      const plan = ctx.config.agentExecutePlan?.[stateName];
      if (plan == null) {
        return;
      }
      await ctx.dispatch({
        type: `each_before`,
        beforeAgentExecuteResult: agentExecutedResult,
      });
      await ctx.dispatch({
        type: `before_${stateName}`,
        beforeAgentExecuteResult: agentExecutedResult,
      });
      const executedResult = await plan.execute(
        ctx,
        agentExecutedResult,
        histories,
      );
      await ctx.dispatch({
        type: `after_${stateName}`,
        executedResult,
      });
      await ctx.dispatch({
        type: `each_after`,
        executedResult,
      });
      histories.push(...executedResult);
      const nextState = await plan.nextAgent(ctx, executedResult, histories);

      if (nextState === "end") {
        return;
      }

      await runState(nextState, executedResult);
    }

    await runState("initialize", []);
    return histories;
  };
}
