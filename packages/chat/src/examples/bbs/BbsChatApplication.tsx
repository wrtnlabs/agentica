import type { ILlmApplication, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import { Agentica } from "@agentica/core";
import typia from "typia";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

import { BbsArticleService } from "./BbsArticleService";

const applications = {
  "chatgpt": typia.llm.application<BbsArticleService, "chatgpt">(),
  "claude": typia.llm.application<BbsArticleService, "claude">(),
  "deepseek": typia.llm.application<BbsArticleService, "deepseek">(),
  "gemini": typia.llm.application<BbsArticleService, "gemini">(),
  "llama": typia.llm.application<BbsArticleService, "llama">(),
  "3.0": typia.llm.application<BbsArticleService, "3.0">(),
  "3.1": typia.llm.application<BbsArticleService, "3.1">(),
};

export function BbsChatApplication(props: BbsChatApplication.IProps) {
  const service: BbsArticleService = new BbsArticleService();
  const agent: Agentica<ILlmSchema.Model> = new Agentica({
    model: "chatgpt",
    vendor: {
      api: props.api,
      model: props.vendorModel,
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: applications[props.schemaModel] as ILlmApplication<ILlmSchema.Model>,
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
    api: OpenAI;
    vendorModel: string;
    schemaModel: ILlmSchema.Model;
    locale?: string;
    timezone?: string;
  }
}
