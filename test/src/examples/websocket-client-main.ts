import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketConnector } from "tgrid";

const main = async () => {
  // Create WebSocketConnector with type specifications
  const connector: WebSocketConnector<
    null,
    IAgenticaRpcListener,
    IAgenticaRpcService<"chatgpt">
  > = new WebSocketConnector(null, {
    // and configuring IAgenticaRpcListener instance
    //
    // server will call these functions remotely (Remote Procedure Call)
    text: async (evt) => {
      console.log(evt.role, evt.text);
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
};
main;
