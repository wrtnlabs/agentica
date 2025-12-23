import { Agentica } from "@agentica/core";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_base_event(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  // initialize count
  let initializeCount = 0;
  // text count
  let textCount = 0;

  // initialize agent
  const agent: Agentica = new Agentica({
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
      }),
    },
    controllers: [],
  });

  // initialize listener
  const initializeListener = () => {
    initializeCount++;
  };
  const textListener = async () => {
    textCount++;
  };

  agent.on("initialize", initializeListener);
  agent.on("assistantMessage", textListener);

  // start conversation
  await agent.conversate("What can you do?");

  // first verify: initialize event should be called once
  if (initializeCount !== 1) {
    throw new Error(
      `Initialize event should be called once, but called ${initializeCount} times`,
    );
  }

  // total once
  if (textCount !== 1) {
    throw new Error(
      `Text event should be called once, but called ${textCount} times`,
    );
  }

  // remove initialize event listener
  agent.off("initialize", initializeListener);

  // second conversation: do not increase initialize count
  await agent.conversate("Tell me more");

  // second verify: initialize count should not increase
  if ((initializeCount as number) !== 1) {
    throw new Error(
      `Initialize count should remain 1, but got ${initializeCount}`,
    );
  }

  // total twice
  if ((textCount as number) !== 2) {
    throw new Error(`Text count should be 2, but got ${textCount}`);
  }

  // remove text event listener
  agent.off("assistantMessage", textListener);

  // third conversation: do not increase count
  await agent.conversate("Final message");

  // final verify: both counts should remain the same
  if ((initializeCount as number) !== 1) {
    throw new Error(
      `Initialize count should remain 1, but got ${initializeCount}`,
    );
  }
  if ((textCount as number) !== 2) {
    throw new Error(`Text count should remain 2, but got ${textCount}`);
  }
}
