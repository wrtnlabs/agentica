import fs from "node:fs";
import process from "node:process";

import type { AgenticaHistory } from "@agentica/core";

import { MicroAgentica } from "@agentica/core";
import chalk from "chalk";
import OpenAI from "openai";
import typia from "typia";

import { BbsArticleService } from "../internal/BbsArticleService";
import { TestGlobal } from "../TestGlobal";
import { ConsoleScanner } from "../utils/ConsoleScanner";

function trace(...args: unknown[]): void {
  console.log("----------------------------------------------");
  console.log(...args);
  console.log("----------------------------------------------");
}

async function main(): Promise<void> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    trace(chalk.redBright("CHATGPT_API_KEY is not set"));
    return;
  }

  // COMPOSE CHAT AGENT
  const agent: MicroAgentica = new MicroAgentica({
    vendor: {
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
        baseURL: TestGlobal.env.CHATGPT_BASE_URL,
      }),
      model: "gpt-4o-mini",
      options: TestGlobal.env.CHATGPT_OPTIONS !== undefined
        ? JSON.parse(TestGlobal.env.CHATGPT_OPTIONS) as OpenAI.RequestOptions
        : undefined,
    },
    controllers: [
      typia.llm.controller<BbsArticleService>(
        "bbs",
        new BbsArticleService(),
      ),
    ],
    config: {
      locale: "en-US",
    },
  });
  agent.on("assistantMessage", async (e) => {
    console.log(chalk.yellow("text"), chalk.blueBright("assistant"), "\n\n", await e.join());
  });
  agent.on("call", e =>
    console.log(chalk.blueBright("call"), e.operation.function.name));
  agent.on("execute", (e) => {
    console.log(
      chalk.greenBright("execute"),
      e.operation.function.name,
      e.value,
    );

    fs.writeFileSync(
      `${TestGlobal.ROOT}/logs/${e.operation.function.name}.log`,
      JSON.stringify(
        {
          type: "function",
          arguments: e.arguments,
          response: e.value,
        },
        null,
        2,
      ),
      null,
    );
  });

  // START CONVERSATION
  while (true) {
    console.log("----------------------------------------------");
    const content: string = await ConsoleScanner.read("Input: ");
    console.log("----------------------------------------------");

    if (content === "$exit") {
      break;
    }
    else if (content === "$usage") {
      trace(
        chalk.redBright("Token Usage"),
        JSON.stringify(agent.getTokenUsage(), null, 2),
      );
    }
    else {
      const histories: AgenticaHistory[]
        = await agent.conversate(content);
      for (const h of histories.slice(1)) {
        if (h.type === "userMessage") {
          trace(
            chalk.yellow("Text"),
            chalk.blueBright("user"),
            "\n\n",
            h.contents.find(c => c.type === "text")?.text,
          );
        }
        if (h.type === "assistantMessage") {
          trace(chalk.yellow("Text"), chalk.blueBright("assistant"), "\n\n", h.text);
        }
        else if (h.type === "describe") {
          trace(
            chalk.whiteBright("Describe"),
            chalk.blueBright("agent"),
            "\n\n",
            h.text,
          );
        }
      }
    }
  }
}
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
