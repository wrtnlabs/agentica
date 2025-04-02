import { Agentica } from "@agentica/core";
import { AgenticaStandalone } from "@agentica/standalone";
import { OpenAI } from "openai";

export default function BbsPlayground() {
  const agentica = new Agentica({
    controllers: [],
    config: {},
    model: "chatgpt",
    vendor: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }),
  });

  return <AgenticaStandalone agentica={agentica} />;
}