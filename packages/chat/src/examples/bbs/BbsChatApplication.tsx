import type OpenAI from "openai";

import { MicroAgentica } from "@agentica/core";
import typia from "typia";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

import { BbsArticleService } from "./BbsArticleService";

export function BbsChatApplication(props: BbsChatApplication.IProps) {
  const service: BbsArticleService = new BbsArticleService();
  const agent: MicroAgentica = new MicroAgentica({
    vendor: {
      api: props.api,
      model: props.vendorModel,
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: typia.llm.application<BbsArticleService>(),
        execute: service,
      },
    ],
    config: {
      locale: props.locale,
      timezone: props.timezone,
    },
  });
  return <AgenticaChatApplication agent={agent} />;
}
export namespace BbsChatApplication {
  export interface IProps {
    api: OpenAI;
    vendorModel: string;
    locale?: string;
    timezone?: string;
  }
}
