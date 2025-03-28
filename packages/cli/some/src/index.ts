import { Agentica } from "@agentica/core";
import typia from "typia";
import dotenv from "dotenv";
import { OpenAI } from "openai";

import { CalendlyService } from "@wrtnlabs/connector-calendly";
import { DaumBlogService } from "@wrtnlabs/connector-daum-blog";

dotenv.config();

export const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    }),
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "Calendly Connector",
      protocol: "class",
      application: typia.llm.application<CalendlyService, "chatgpt">(),
      execute: new CalendlyService(),
    },
    {
      name: "DaumBlog Connector",
      protocol: "class",
      application: typia.llm.application<DaumBlogService, "chatgpt">(),
      execute: new DaumBlogService(),
    },
  ],
});

const main = async () => {
  console.log(await agent.conversate("What can you do?"));
};

main();
