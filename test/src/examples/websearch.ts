import type { ILlmApplication } from "@samchon/openapi";

import { MicroAgentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { TestGlobal } from "../TestGlobal";

import type { IWrtnWebSearchApplication } from "./internal/IWrtnWebSearchApplication";

async function main(): Promise<void> {
  const application: ILlmApplication<"chatgpt", IWrtnWebSearchApplication> = typia.llm.application<IWrtnWebSearchApplication, "chatgpt">();
  const agent: MicroAgentica<"chatgpt"> = new MicroAgentica({
    model: "chatgpt",
    controllers: [
      {
        protocol: "class",
        name: "service",
        application,
        execute: {
          search: async (props: IWrtnWebSearchApplication.IProps): Promise<void> => {
            console.log("web searched", props);
          },
        } satisfies IWrtnWebSearchApplication,
      },
    ],
    vendor: {
      model: "gpt-4.1",
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
      }),
    },
    config: {
      executor: {
        describe: null,
      },
      systemPrompt: {
        common: () => "",
        execute: () => "",
      },
    },
  });
  const histories = await agent.conversate("I want to know about typia. Search the content from website, and tell me about it.");
  console.log(JSON.stringify(histories.find(h => h.type === "execute"), null, 2));
}
main().catch(console.error);
