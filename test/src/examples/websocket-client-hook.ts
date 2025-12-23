import process from "node:process";

import type { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import type { ILlmFunction, ILlmSchema } from "@samchon/openapi";
import type { Driver } from "tgrid";

import { WebSocketConnector } from "tgrid";

async function fillArguments(_param: ILlmSchema.IParameters): Promise<Record<string, any>> {
  return {};
}

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
    call: async (event) => {
      // @TODO Omg... I'm not sure how to fix it.
      // eslint-disable-next-line ts/no-use-before-define
      const func: ILlmFunction | undefined = controllers
        .find(c => c.name === event.operation.controller)
        ?.application
        .functions
        .find(
          f => f.name === event.operation.function,
        );
      if (func === undefined || func.separated?.human == null) {
        return null;
      }
      return fillArguments(func.separated.human);
    },
  });
  await connector.connect("ws://localhost:3001");

  const driver: Driver<IAgenticaRpcService> = connector.getDriver();
  const controllers = await driver.getControllers();
  await driver.conversate("I wanna create an article with file uploading.");

  await connector.close();
}
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
