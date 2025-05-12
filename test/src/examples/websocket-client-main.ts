import process from "node:process";

import type { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import type { Driver } from "tgrid";

import { WebSocketConnector } from "tgrid";

async function main() {
  // Create WebSocketConnector with type specifications
  const connector: WebSocketConnector<
    null,
    IAgenticaRpcListener,
    IAgenticaRpcService<"chatgpt">
  > = new WebSocketConnector(null, {
    // and configuring IAgenticaRpcListener instance
    //
    // server will call these functions remotely (Remote Procedure Call)
    assistantMessage: async (evt) => {
      console.log("assistantMessage", evt.text);
    },
    select: async (evt) => {
      console.log("selector", evt.selection);
    },
    execute: async (evt) => {
      console.log("execute", evt.operation, evt.arguments, evt.value);
    },
    describe: async (evt) => {
      console.log("describer", evt.text);
    },
  });

  // Connect to the server
  //
  // if server accepts
  await connector.connect("ws://localhost:3001");

  // Call the server's functions remotely (Remote Procedure Call)
  const driver: Driver<IAgenticaRpcService<"chatgpt">> = connector.getDriver();
  await driver.conversate("Hello, what you can do?");

  // Disconnect after your job
  await connector.close();
}
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
