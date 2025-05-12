import type { AgenticaHistory } from "@agentica/core";

import { Agentica } from "@agentica/core";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_base_work(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
      }),
    },
    controllers: [],
  });
  const result: AgenticaHistory<"chatgpt">[]
    = await agent.conversate("What your role?");
  if (result[0]?.type !== "assistant" || result[0]?.text !== "What your role?") {
    throw new Error("Result is not equal to prompt histories");
  }
}
