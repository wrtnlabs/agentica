import type { IAgenticaEventJson } from "@agentica/core";
import type {
  IAgenticaRpcService,
  IMicroAgenticaRpcListener,
} from "@agentica/rpc";
import type { Driver } from "tgrid";

import { MicroAgentica } from "@agentica/core";
import { MicroAgenticaRpcService } from "@agentica/rpc";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";
import { WebSocketConnector, WebSocketServer } from "tgrid";
import { randint } from "tstl";
import typia from "typia";

import { BbsArticleService } from "../../internal/BbsArticleService";
import { TestGlobal } from "../../TestGlobal";

export async function test_rpc_micro_call(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const agent: MicroAgentica<"chatgpt"> = new MicroAgentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.chatgptApiKey,
      }),
    },
    controllers: [
      {
        protocol: "class",
        name: "bbs",
        application: typia.llm.application<BbsArticleService, "chatgpt">(),
        execute: new BbsArticleService(),
      },
    ],
  });

  const port: number = randint(30_001, 65_001);
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IMicroAgenticaRpcListener
  > = new WebSocketServer();
  await server.open(port, async (acceptor) => {
    await acceptor.accept(
      new MicroAgenticaRpcService({
        agent,
        listener: acceptor.getDriver(),
      }),
    );
  });

  const events: IAgenticaEventJson[] = [];
  const connector: WebSocketConnector<
    null,
    IMicroAgenticaRpcListener,
    IAgenticaRpcService<"chatgpt">
  > = new WebSocketConnector(null, {
    describe: async (evt) => {
      events.push(evt);
    },
    assistantMessage: async (evt) => {
      events.push(evt);
    },
    call: async (evt) => {
      events.push(evt);
    },
    execute: async (evt) => {
      events.push(evt);
    },
  });
  await connector.connect(`ws://localhost:${port}`);

  const driver: Driver<IAgenticaRpcService<"chatgpt">> = connector.getDriver();
  await driver.conversate("What can you do?");
  await driver.conversate(`
    Create an article like below:

      - title: Hello World
      - body: Hello, my name is John Doe
      - thumbnail: null
  `);
  await connector.close();
  await server.close();

  TestValidator.equals("events")(
    events.map(e => e.type),
  )([
    "userMessage",
    "assistantMessage",
    "userMessage",
    "call",
    "execute",
    "describe",
  ]);
}
