import { IAgenticaTokenUsage } from "@agentica/core/src/structures/IAgenticaTokenUsage";

export namespace TokenUsageComputer {
  export const zero = (): IAgenticaTokenUsage => ({
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
    a: IAgenticaTokenUsage,
    b: IAgenticaTokenUsage,
  ): IAgenticaTokenUsage => ({
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
