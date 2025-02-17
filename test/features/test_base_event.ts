import { WrtnAgent } from "@wrtnlabs/agent";
import OpenAI from "openai";

export async function test_base_event() {
  // 이벤트 리스너 호출 횟수를 추적하기 위한 카운터
  let initializeCount = 0;
  let textCount = 0;

  // 에이전트 생성
  const agent: WrtnAgent = new WrtnAgent({
    provider: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: process.env.CHATGPT_API_KEY,
      }),
      type: "chatgpt",
    },
    controllers: [],
  });

  // 이벤트 리스너 등록
  const initializeListener = () => {
    initializeCount++;
  };
  const textListener = () => {
    textCount++;
  };

  agent.on("initialize", initializeListener);
  agent.on("text", textListener);

  // start conversation
  await agent.conversate("What can you do?");

  // first verify: initialize event should be called once
  if (initializeCount !== 1) {
    throw new Error(
      `Initialize event should be called once, but called ${initializeCount} times`,
    );
  }

  // total twice: initialize, select
  if (textCount !== 2) {
    throw new Error(
      `Text event should be called twice, but called ${textCount} times`,
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

  // total twice: (initialize, select) * 2
  if ((textCount as number) !== 4) {
    throw new Error(`Text count should be 4, but got ${textCount}`);
  }

  // remove text event listener
  agent.off("text", textListener);

  // third conversation: do not increase count
  await agent.conversate("Final message");

  // final verify: both counts should remain the same
  if ((initializeCount as number) !== 1) {
    throw new Error(
      `Initialize count should remain 1, but got ${initializeCount}`,
    );
  }
  if ((textCount as number) !== 4) {
    throw new Error(`Text count should remain 4, but got ${textCount}`);
  }

  return await Promise.resolve();
}
