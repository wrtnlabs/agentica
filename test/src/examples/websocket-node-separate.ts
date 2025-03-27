import type {
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import process from "node:process";
import { Agentica } from "@agentica/core";
import {
  AgenticaRpcService,
} from "@agentica/rpc";
import { LlamaTypeChecker } from "@samchon/openapi";
import OpenAI from "openai";
import { WebSocketServer } from "tgrid";
import typia from "typia";

async function main(): Promise<void> {
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"llama">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  await server.open(3_001, async (acceptor) => {
    const agent: Agentica<"llama"> = new Agentica({
      model: "llama",
      vendor: {
        api: new OpenAI(),
        model: "llama-3.3-70b",
      },
      controllers: [
        {
          name: "bbs",
          protocol: "class",
          application: typia.llm.application<BbsArticleService, "llama">({
            separate: schema =>
              LlamaTypeChecker.isString(schema)
              && schema.format === "uri"
              && schema.contentMediaType !== undefined,
          }),
          execute: new BbsArticleService(),
        },
      ],
    });
    const service: AgenticaRpcService<"llama"> = new AgenticaRpcService({
      agent,
      listener: acceptor.getDriver(),
    });
    await acceptor.accept(service);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(-1);
});

class BbsArticleService {
  public plus(props: { x: number; y: number }): number {
    return props.x + props.y;
  }
}
