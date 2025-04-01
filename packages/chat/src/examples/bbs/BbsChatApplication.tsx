import { Agentica } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

import { BbsArticleService } from "./BbsArticleService";

export function BbsChatApplication(props: BbsChatApplication.IProps) {
  const service: BbsArticleService = new BbsArticleService();
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      api: new OpenAI({
        apiKey: props.apiKey,
        dangerouslyAllowBrowser: true,
      }),
      model: props.model ?? "gpt-4o-mini",
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: typia.llm.applicationOfValidate<
          BbsArticleService,
          "chatgpt"
        >(),
        execute: service,
      },
    ],
    config: {
      locale: props.locale,
      timezone: props.timezone,
      executor: {
        initialize: null,
      },
    },
  });
  return <AgenticaChatApplication agent={agent} />;
}
export namespace BbsChatApplication {
  export interface IProps {
    apiKey: string;
    model?: OpenAI.ChatModel;
    locale?: string;
    timezone?: string;
  }
}
