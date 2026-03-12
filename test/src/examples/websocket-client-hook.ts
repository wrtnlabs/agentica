import process from "node:process";

import type { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import type { Driver } from "tgrid";

import { WebSocketConnector } from "tgrid";

async function main() {
  const connector: WebSocketConnector<
    null,
    IAgenticaRpcListener,
    IAgenticaRpcService
  > = new WebSocketConnector(null, {
    userMessage: async () => {},
    assistantMessage: async (evt) => {
      console.log("assistant", evt.text);
    },
    describe: async (evt) => {
      console.log("describer", evt.text);
    },
  });
  await connector.connect("ws://localhost:3001");

  const driver: Driver<IAgenticaRpcService> = connector.getDriver();
  await driver.conversate("I wanna create an article with file uploading.");

  await connector.close();
}
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
