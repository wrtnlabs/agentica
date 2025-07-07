import type { AgenticaExecuteEvent, AgenticaJsonParseErrorEvent } from "@agentica/core";

import { Agentica } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";
import typia from "typia";
import { v4 } from "uuid";

import { BbsArticleService } from "../internal/BbsArticleService";
import { TestGlobal } from "../TestGlobal";

export async function test_json_parse_error_correction(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
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
        application: typia.llm.application<BbsArticleService, "chatgpt">(),
        execute: new BbsArticleService(),
      },
    ],
  });

  let polluted: boolean = false;
  let executeEvent: AgenticaExecuteEvent<"chatgpt"> | null = null;

  agent.on("call", (event) => {
    if (polluted === true) {
      return;
    }
    const jsonParseErrorEvent: AgenticaJsonParseErrorEvent<"chatgpt"> = {
      type: "jsonParseError",
      id: v4(),
      created_at: new Date().toISOString(),
      operation: event.operation,
      arguments: JSON.stringify(event.arguments).slice(0, -1),
      errorMessage: "Unexpected token '}' in JSON at last position",
    };
    for (const key of Object.keys(event.arguments)) {
      delete (event as Record<string, any>)[key];
    }
    Object.assign(event, jsonParseErrorEvent);
    polluted = true;
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
  TestValidator.equals("executeEvent")(executeEvent !== null)(true);
}
