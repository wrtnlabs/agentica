import type { CompletionUsage } from "openai/resources";

import { ChatGptTokenUsageAggregator } from "./ChatGptTokenUsageAggregator";

describe("chatGptTokenUsageAggregator", () => {
  describe("sum", () => {
    it("should sum basic token usage", () => {
      const usage1: CompletionUsage = {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      };

      const usage2: CompletionUsage = {
        prompt_tokens: 20,
        completion_tokens: 10,
        total_tokens: 30,
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result).toEqual({
        prompt_tokens: 30,
        completion_tokens: 15,
        total_tokens: 45,
        completion_tokens_details: {
          accepted_prediction_tokens: 0,
          reasoning_tokens: 0,
          rejected_prediction_tokens: 0,
        },
        prompt_tokens_details: {
          audio_tokens: 0,
          cached_tokens: 0,
        },
      });
    });

    it("should handle undefined values", () => {
      const usage1: CompletionUsage = {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
      };

      const usage2: CompletionUsage = {
      // @ts-expect-error - intended to be undefined
        prompt_tokens: undefined,
        // @ts-expect-error - intended to be undefined
        completion_tokens: undefined,
        // @ts-expect-error - intended to be undefined
        total_tokens: undefined,
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result).toEqual({
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        completion_tokens_details: {
          accepted_prediction_tokens: 0,
          reasoning_tokens: 0,
          rejected_prediction_tokens: 0,
        },
        prompt_tokens_details: {
          audio_tokens: 0,
          cached_tokens: 0,
        },
      });
    });

    it("should sum completion token details", () => {
      const usage1: CompletionUsage = {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        completion_tokens_details: {
          accepted_prediction_tokens: 3,
          reasoning_tokens: 1,
          rejected_prediction_tokens: 1,
        },
      };

      const usage2: CompletionUsage = {
        prompt_tokens: 20,
        completion_tokens: 10,
        total_tokens: 30,
        completion_tokens_details: {
          accepted_prediction_tokens: 7,
          reasoning_tokens: 2,
          rejected_prediction_tokens: 1,
        },
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result.completion_tokens_details).toEqual({
        accepted_prediction_tokens: 10,
        reasoning_tokens: 3,
        rejected_prediction_tokens: 2,
      });
    });

    it("should handle undefined completion token details", () => {
      const usage1: CompletionUsage = {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        completion_tokens_details: {
          accepted_prediction_tokens: 3,
          reasoning_tokens: 1,
          rejected_prediction_tokens: 1,
        },
      };

      const usage2: CompletionUsage = {
        prompt_tokens: 20,
        completion_tokens: 10,
        total_tokens: 30,
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result.completion_tokens_details).toEqual({
        accepted_prediction_tokens: 3,
        reasoning_tokens: 1,
        rejected_prediction_tokens: 1,
      });
    });

    it("should sum prompt token details", () => {
      const usage1: CompletionUsage = {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        prompt_tokens_details: {
          audio_tokens: 3,
          cached_tokens: 2,
        },
      };

      const usage2: CompletionUsage = {
        prompt_tokens: 20,
        completion_tokens: 10,
        total_tokens: 30,
        prompt_tokens_details: {
          audio_tokens: 7,
          cached_tokens: 3,
        },
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result.prompt_tokens_details).toEqual({
        audio_tokens: 10,
        cached_tokens: 5,
      });
    });

    it("should handle undefined prompt token details", () => {
      const usage1: CompletionUsage = {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        prompt_tokens_details: {
          audio_tokens: 3,
          cached_tokens: 2,
        },
      };

      const usage2: CompletionUsage = {
        prompt_tokens: 20,
        completion_tokens: 10,
        total_tokens: 30,
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result.prompt_tokens_details).toEqual({
        audio_tokens: 3,
        cached_tokens: 2,
      });
    });

    it("should handle all undefined values", () => {
      const usage1: CompletionUsage = {
      // @ts-expect-error - intended to be undefined
        prompt_tokens: undefined,
        // @ts-expect-error - intended to be undefined
        completion_tokens: undefined,
        // @ts-expect-error - intended to be undefined
        total_tokens: undefined,
        completion_tokens_details: undefined,
        prompt_tokens_details: undefined,
      };

      const usage2: CompletionUsage = {
      // @ts-expect-error - intended to be undefined
        prompt_tokens: undefined,
        // @ts-expect-error - intended to be undefined
        completion_tokens: undefined,
        // @ts-expect-error - intended to be undefined
        total_tokens: undefined,
        completion_tokens_details: undefined,
        prompt_tokens_details: undefined,
      };

      const result = ChatGptTokenUsageAggregator.sum(usage1, usage2);

      expect(result).toEqual({
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0,
        completion_tokens_details: {
          accepted_prediction_tokens: 0,
          reasoning_tokens: 0,
          rejected_prediction_tokens: 0,
        },
        prompt_tokens_details: {
          audio_tokens: 0,
          cached_tokens: 0,
        },
      });
    });
  });
});
