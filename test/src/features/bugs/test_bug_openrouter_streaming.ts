import type { AgenticaHistory } from "@agentica/core";

import { Agentica } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";
import typia from "typia";

import { BbsArticleService } from "../../internal/BbsArticleService";
import { TestGlobal } from "../../TestGlobal";

export async function test_bug_openrouter_streaming(): Promise<void | false> {
  if (TestGlobal.env.OPENROUTER_API_KEY === undefined) {
    return false;
  }

  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      api: new OpenAI({
        apiKey: TestGlobal.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
      }),
      model: "openai/gpt-4o-mini",
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: typia.llm.application<BbsArticleService, "chatgpt">(),
        execute: new BbsArticleService(),
      },
    ],
  });

  const histories: AgenticaHistory<"chatgpt">[] = await agent.conversate(`
    I will create a new article.

    Title is "Introduce typia, superfast runtime validator", and thumbnail URL is https://typia.io/logo.png

    Content body is below.

    "typia" is a transformer library supporting below features:

    - Super-fast runtime validators
    - Enhanced JSON schema and serde functions
    - LLM function calling schema and structured output
    - Protocol Buffer encoder and decoder
    - Random data generator

    For reference, "typia"'s runtime validator 20,000x faster than 
    "class-validator" by utilizing the AoT (Ahead of Time) compilation 
    strategy. Let's visit typia website https://typia.io, and enjoy 
    its super-fast performance.
  `);
  TestValidator.predicate("text.length")(
    () =>
      histories
        .filter(h => h.type === "assistantMessage")
        .every(h => h.text.length !== 0),
  );
}
