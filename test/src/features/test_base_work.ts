import type { AgenticaHistory } from "@agentica/core";

import { Agentica } from "@agentica/core";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_base_work(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const agent: Agentica = new Agentica({
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        
        apiKey: TestGlobal.chatgptApiKey,
        baseURL: TestGlobal.chatgptBaseUrl,
      }),
    },
    controllers: [],
  });
  const result: AgenticaHistory[]
    = await agent.conversate("What your role?");
  if (
    result[0]?.type === "userMessage"
    && result[0].contents.length === 1
    && result[0].contents[0]?.type === "text"
    && result[0].contents[0].text === "What your role?"
  ) {
    return;
  }

  throw new Error("Result is not equal to prompt histories");
}
