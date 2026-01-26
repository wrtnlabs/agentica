import type { MicroAgenticaHistory } from "@agentica/core";

import { MicroAgentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { BbsArticleService } from "../internal/BbsArticleService";
import { TestGlobal } from "../TestGlobal";

export async function test_micro_agentica(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const agent: MicroAgentica = new MicroAgentica({
    vendor: {
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
        baseURL: TestGlobal.chatgptBaseUrl,
      }),
      model: "gpt-4o-mini",
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: typia.llm.application<BbsArticleService>(),
        execute: new BbsArticleService(),
      },
    ],
  });
  await agent.conversate(`
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
  typia.assert<MicroAgenticaHistory.Type[]>(agent.getHistories().map(h => h.type));
  if (predicate(agent.getHistories()) === false) {
    await agent.conversate("Do it.");
    const result: boolean = predicate(agent.getHistories());
    if (result === false) {
      console.log(agent.getHistories());
      throw new Error("Failed to call the function.");
    }
  }
}

function predicate(histories: MicroAgenticaHistory[]): boolean {
  return histories.some(h => h.type === "execute" || h.type === "describe");
}
