import { IWrtnAgentTokenUsage } from "../module";

export namespace TokenUsageComputer {
  export const zero = (): IWrtnAgentTokenUsage => ({
    total: 0,
    prompt: {
      total: 0,
      audio: 0,
      cached: 0,
    },
    completion: {
      total: 0,
      accepted_prediction: 0,
      audio: 0,
      reasoning: 0,
      rejected_prediction: 0,
    },
  });

  export const plus = (
    a: IWrtnAgentTokenUsage,
    b: IWrtnAgentTokenUsage,
  ): IWrtnAgentTokenUsage => ({
    total: a.total + b.total,
    prompt: {
      total: a.prompt.total + b.prompt.total,
      audio: a.prompt.audio + b.prompt.audio,
      cached: a.prompt.cached + b.prompt.cached,
    },
    completion: {
      total: a.completion.total + b.completion.total,
      accepted_prediction:
        a.completion.accepted_prediction + b.completion.accepted_prediction,
      audio: a.completion.audio + b.completion.audio,
      reasoning: a.completion.reasoning + b.completion.reasoning,
      rejected_prediction:
        a.completion.rejected_prediction + b.completion.rejected_prediction,
    },
  });
}
