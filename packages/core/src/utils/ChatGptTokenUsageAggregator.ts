import type { CompletionUsage } from "openai/resources";

function sumCompletionTokenDetail(x: CompletionUsage.CompletionTokensDetails, y: CompletionUsage.CompletionTokensDetails): CompletionUsage.CompletionTokensDetails {
  return {
    accepted_prediction_tokens:
        (x.accepted_prediction_tokens ?? 0)
        + (y.accepted_prediction_tokens ?? 0),
    reasoning_tokens: (x.reasoning_tokens ?? 0) + (y.reasoning_tokens ?? 0),
    rejected_prediction_tokens:
        (x.rejected_prediction_tokens ?? 0)
        + (y.rejected_prediction_tokens ?? 0),
  };
}

function sumPromptTokenDetail(x: CompletionUsage.PromptTokensDetails, y: CompletionUsage.PromptTokensDetails): CompletionUsage.PromptTokensDetails {
  return {
    audio_tokens: (x.audio_tokens ?? 0) + (y.audio_tokens ?? 0),
    cached_tokens: (x.cached_tokens ?? 0) + (y.cached_tokens ?? 0),
  };
}

function sum(x: CompletionUsage, y: CompletionUsage): CompletionUsage {
  return {
    prompt_tokens: (x.prompt_tokens ?? 0) + (y.prompt_tokens ?? 0),
    completion_tokens:
        (x.completion_tokens ?? 0) + (y.completion_tokens ?? 0),
    total_tokens: (x.total_tokens ?? 0) + (y.total_tokens ?? 0),
    completion_tokens_details: sumCompletionTokenDetail(
      x.completion_tokens_details ?? {
        accepted_prediction_tokens: 0,
        reasoning_tokens: 0,
        rejected_prediction_tokens: 0,
      },
      y.completion_tokens_details ?? {
        accepted_prediction_tokens: 0,
        reasoning_tokens: 0,
        rejected_prediction_tokens: 0,
      },
    ),
    prompt_tokens_details: sumPromptTokenDetail(
      x.prompt_tokens_details ?? {
        audio_tokens: 0,
        cached_tokens: 0,
      },
      y.prompt_tokens_details ?? {
        audio_tokens: 0,
        cached_tokens: 0,
      },
    ),
  };
}

export const ChatGptTokenUsageAggregator = {
  sum,
  sumCompletionTokenDetail,
  sumPromptTokenDetail,
};
