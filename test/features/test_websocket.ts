import { TestValidator } from "@nestia/e2e";
import {
  IWrtnAgentEvent,
  IWrtnAgentRpcListener,
  IWrtnAgentRpcService,
  WrtnAgent,
  WrtnAgentRpcService,
} from "@wrtnlabs/agent";
import OpenAI from "openai";
import { WebSocketConnector, WebSocketServer } from "tgrid";
import { randint } from "tstl";
import { Primitive } from "typia";

export const test_websocket = async (): Promise<void> => {
  const port: number = randint(30_001, 65_001);
  const server: WebSocketServer<
    null,
    IWrtnAgentRpcService,
    IWrtnAgentRpcListener
  > = new WebSocketServer();
  await server.open(port, async (acceptor) => {
    const agent: WrtnAgent = new WrtnAgent({
      provider: {
        model: "gpt-4o-mini",
        api: new OpenAI({
          apiKey: process.env.CHATGPT_API_KEY,
        }),
        type: "chatgpt",
      },
      controllers: [],
    });
    await acceptor.accept(
      new WrtnAgentRpcService({
        agent,
        listener: acceptor.getDriver(),
      }),
    );
  });

  const events: Primitive<IWrtnAgentEvent>[] = [];
  const connector: WebSocketConnector<
    null,
    IWrtnAgentRpcListener,
    IWrtnAgentRpcService
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
  await connector.getDriver().conversate("What can you do?");
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
  ] satisfies Primitive<Partial<IWrtnAgentEvent>>[] as Primitive<
    Partial<IWrtnAgentEvent>
  >[])(events);
};
