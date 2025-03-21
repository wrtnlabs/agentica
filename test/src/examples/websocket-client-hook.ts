import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { ILlamaSchema, ILlmFunction } from "@samchon/openapi";
import { Driver, WebSocketConnector } from "tgrid";

const fillArguments = async (
  param: ILlamaSchema.IParameters,
): Promise<Record<string, any>> => {
  param;
  return {} as any;
};

const main = async () => {
  const connector: WebSocketConnector<
    null,
    IAgenticaRpcListener,
    IAgenticaRpcService<"llama">
  > = new WebSocketConnector(null, {
    text: async (evt) => {
      console.log(evt.role, evt.text);
    },
    describe: async (evt) => {
      console.log("describer", evt.text);
    },
    call: async (event) => {
      const func: ILlmFunction<"llama"> | undefined = controllers
        .find((c) => c.name === event.operation.controller)
        ?.application.functions.find(
          (f) => f.name === event.operation.function,
        );
      if (!func?.separated?.human) return null;
      return fillArguments(func.separated.human);
    },
  });
  await connector.connect("ws://localhost:3001");

  const driver: Driver<IAgenticaRpcService<"llama">> = connector.getDriver();
  const controllers = await driver.getControllers();
  await driver.conversate("I wanna create an article with file uploading.");

  await connector.close();
};
main;
