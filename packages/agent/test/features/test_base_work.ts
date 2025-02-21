import { IWrtnAgentPrompt, WrtnAgent } from "@wrtnlabs/agent";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_base_work(): Promise<void | false> {
  if (!TestGlobal.env.CHATGPT_API_KEY) return false;

  const agent: WrtnAgent = new WrtnAgent({
    provider: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
      }),
      type: "chatgpt",
    },
    controllers: [],
  });
  const result: IWrtnAgentPrompt[] = await agent.conversate("What your role?");
  if (result[0]?.type !== "text" || result[0]?.text !== "What your role?") {
    throw new Error("Result is not equal to prompt histories");
  }
}
