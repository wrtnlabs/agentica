import assert from "node:assert";

import type { AgenticaAssistantMessageEvent, IAgenticaController } from "@agentica/core";

import { Agentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { TestGlobal } from "../TestGlobal";

class Weather {
  public getWeather(props: {
    /**
     * City to get weather
     */
    city: string;
  }): string {
    return `The weather in ${props.city} is sunny`;
  }
}

export async function test_select_streaming_base(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const controller: IAgenticaController<"chatgpt"> = {
    protocol: "class",
    name: "weather",
    application: typia.llm.application<Weather, "chatgpt">(),
    execute: new Weather(),
  };
  const agent = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
      }),
    },
    controllers: [controller],
    config: {
      executor: {
        initialize: null,
        describe: null,
      },
    },
  });

  let isAssistantMessageStreaming = false;
  agent.on("assistantMessage", async (event: AgenticaAssistantMessageEvent) => {
    let count = 0;
    for await (const _ of event.stream) {
      count++;
    }
    isAssistantMessageStreaming = count > 2;
  });

  const result = await agent.conversate("Please create the BBS article with the title 'Hello, world!' and the content 'This is a test article.'");
  assert(result.length === 2);
  assert(result[0]?.type === "userMessage");
  assert(result[1]?.type === "assistantMessage");
  assert(isAssistantMessageStreaming);
}
