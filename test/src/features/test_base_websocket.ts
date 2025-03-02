import { Agentica, IAgenticaEvent } from "@agentica/core";
import {
  AgenticaRpcService,
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import { TestValidator } from "@nestia/e2e";
import OpenAI from "openai";
import { Driver, WebSocketConnector, WebSocketServer } from "tgrid";
import { randint } from "tstl";
import { Primitive } from "typia";

import { TestGlobal } from "../TestGlobal";

export const test_base_websocket = async (): Promise<void | false> => {
  if (!TestGlobal.env.CHATGPT_API_KEY) return false;

  const port: number = randint(30_001, 65_001);
  const server: WebSocketServer<
    null,
    IAgenticaRpcService<"chatgpt">,
    IAgenticaRpcListener<"chatgpt">
  > = new WebSocketServer();
  await server.open(port, async (acceptor) => {
    const agent: Agentica<"chatgpt"> = new Agentica({
      model: "chatgpt",
      provider: {
        model: "gpt-4o-mini",
        api: new OpenAI({
          apiKey: TestGlobal.env.CHATGPT_API_KEY,
        }),
      },
      controllers: [],
    });
    await acceptor.accept(
      new AgenticaRpcService({
        agent,
        listener: (acceptor as any).getDriver(),
      }),
    );
  });

  const events: Primitive<IAgenticaEvent<"chatgpt">>[] = [];
  const connector: WebSocketConnector<
    null,
    IAgenticaRpcListener<"chatgpt">,
    IAgenticaRpcService<"chatgpt">
  > = new WebSocketConnector(null, {
    describe: async (evt) => {
      events.push(evt);
    },
    text: async (evt) => {
      events.push(evt);
    },
    initialize: async (evt) => {
      events.push(evt);
    },
  });
  await connector.connect(`ws://localhost:${port}`);

  const driver: Driver<IAgenticaRpcService<"chatgpt">> = (
    connector as any
  ).getDriver();
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
  ] satisfies Primitive<Partial<IAgenticaEvent<"chatgpt">>>[] as Primitive<
    Partial<IAgenticaEvent<"chatgpt">>
  >[])(events);
};
