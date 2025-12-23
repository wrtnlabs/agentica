import type { AgenticaExecuteEvent, AgenticaValidateEvent } from "@agentica/core";

import { Agentica } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";
import typia from "typia";

import { BbsArticleService } from "../internal/BbsArticleService";
import { TestGlobal } from "../TestGlobal";

export async function test_validate_correction(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const agent: Agentica = new Agentica({
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
      }),
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

  let polluted: boolean = false;
  let validateEvent: AgenticaValidateEvent | null = null;
  let executeEvent: AgenticaExecuteEvent | null = null;

  agent.on("call", (event) => {
    if (polluted === true) {
      return;
    }
    const input = event.arguments.input;
    typia.assertGuard<{ body: string }>(input);
    input.body = {
      data: input.body,
    } as unknown as string;
    polluted = true;
  });
  agent.on("validate", (event) => {
    validateEvent = event;
  });
  agent.on("execute", (event) => {
    executeEvent = event;
  });

  await agent.conversate(`
    Create an article like below:

      - title: Hello World
      - body: Hello, my name is John Doe
      - thumbnail: null
  `);
  TestValidator.equals("polluted")(polluted)(true);
  TestValidator.equals("validateEvent")(validateEvent !== null)(true);
  TestValidator.equals("executeEvent")(executeEvent !== null)(true);
}
