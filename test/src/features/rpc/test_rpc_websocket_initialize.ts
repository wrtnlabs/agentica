import type { IAgenticaEventJson } from "@agentica/core";
import type {
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import type { Driver } from "tgrid";

import { Agentica } from "@agentica/core";
import {
  AgenticaRpcService,
} from "@agentica/rpc";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";
import { WebSocketConnector, WebSocketServer } from "tgrid";
import { randint } from "tstl";

import { TestGlobal } from "../../TestGlobal";

export async function test_rpc_websocket_initialize(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  const port: number = randint(30_001, 65_001);
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener
  > = new WebSocketServer();
  await server.open(port, async (acceptor) => {
    const agent: Agentica<"chatgpt"> = new Agentica({
      model: "chatgpt",
      vendor: {
        model: "gpt-4o-mini",
        api: new OpenAI({
          apiKey: TestGlobal.chatgptApiKey,
        }),
      },
      config: {
        executor: {
          initialize: true,
        },
      },
      controllers: [],
    });
    await acceptor.accept(
      new AgenticaRpcService({
        agent,
        listener: acceptor.getDriver(),
      }),
    );
  });

  const events: IAgenticaEventJson[] = [];
  const connector: WebSocketConnector<
    null,
    IAgenticaRpcListener,
    IAgenticaRpcService<"chatgpt">
  > = new WebSocketConnector(null, {
    describe: async (evt) => {
      events.push(evt);
    },
    assistantMessage: async (evt) => {
      events.push(evt);
    },
    initialize: async (evt) => {
      events.push(evt);
    },
  });
  await connector.connect(`ws://localhost:${port}`);

  const driver: Driver<IAgenticaRpcService<"chatgpt">> = connector.getDriver();
  await driver.conversate("What can you do?");
  await connector.close();
  await server.close();

  TestValidator.equals("events")([
    {
      type: "text",
      role: "user",
    },
    {
      type: "initialize",
    },
    {
      type: "text",
      role: "assistant",
    },
  ])(events);
}
