import { Agentica } from "@agentica/core";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_middleware(): Promise<void> {
  //----
  // PREPARATIONS
  //----
  const agent: Agentica = new Agentica({
    provider: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
      }),
      type: "chatgpt",
    },
    controllers: [],
  });

  let i = 1;
  agent.use(function middleware_one(_ctx, next) {
    i = i + 1; // 2
    console.log(i);
    next();
  });

  agent.use(function middleware_two(_ctx, next) {
    i = i * 2; // 4
    console.log(i);
    next();
  });

  agent.use(async function middleware_three(_ctx, next) {
    i = i - 1; // 3
    console.log(i);
    await next();
  });

  TestValidator.equals("order of execution of middleware")(i)(3);
}
