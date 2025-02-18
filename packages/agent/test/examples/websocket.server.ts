import {
  IWrtnAgentRpcListener,
  IWrtnAgentRpcService,
  WrtnAgent,
  WrtnAgentRpcService,
} from "@wrtnlabs/agent";
import OpenAI from "openai";
import { WebSocketServer } from "tgrid";

import { TestGlobal } from "../TestGlobal";

const main = async (): Promise<void> => {
  const server: WebSocketServer<
    null,
    IWrtnAgentRpcService,
    IWrtnAgentRpcListener
  > = new WebSocketServer();
  await server.open(3001, async (acceptor) => {
    const agent = new WrtnAgent({
      provider: {
        api: new OpenAI({
          apiKey: TestGlobal.env.CHATGPT_API_KEY,
        }),
        model: "gpt-4o-mini",
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
};
main().catch(console.error);
