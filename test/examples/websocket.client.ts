import { IWrtnAgentRpcListener, IWrtnAgentRpcService } from "@wrtnlabs/agent";
import { Driver, WebSocketConnector } from "tgrid";

const main = async (): Promise<void> => {
  const connector: WebSocketConnector<
    null,
    IWrtnAgentRpcListener,
    IWrtnAgentRpcService
  > = new WebSocketConnector(null, {
    text: async (evt) => {
      console.log(evt.role, evt.text);
    },
    describe: async (evt) => {
      console.log("describer", evt.text);
    },
  });
  await connector.connect("ws://localhost:3001");

  const driver: Driver<IWrtnAgentRpcService> = connector.getDriver();
  await driver.conversate("Hello, what you can do?");
};
main().catch(console.error);
