import { IAgenticaEventJson } from "@agentica/core";

/**
 * RPC interface of AI agent listener.
 *
 * `IAgenticaRpcListener` is an interface defining an AI agent listener
 * provided from the client to server through the RPC (Remote Procedure Call)
 * paradigm in the websocket protocol.
 *
 * It has defined the event listener functions of {@link AgenticaEvent}
 * types. If you skip some event typed functions' implementations,
 * the skipped event would be ignored.
 *
 * Also, the event like listener functions of `IAgenticaRpcListener` type
 * are remotely called when a client calls the
 * {@link IAgenticaRpcService.conversate} function remotely, so that the
 * server responses to the client by the event listener functions.
 *
 * You can connect to the WebSocket server of the AI agent like below:
 *
 * ```typescript
 * import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/core";
 * import { Driver, WebSocketConnector } from "tgrid";
 *
 * const connector: WebSocketConnector<
 *   null,
 *   IAgenticaRpcListener,
 *   IAgenticaRpcService
 * > = new WebSocketConnector(null, {
 *   text: async (evt) => {
 *     console.log(evt.role, evt.text);
 *   },
 *   describe: async (evt) => {
 *     console.log("describer", evt.text);
 *   },
 * });
 * await connector.connect("ws://localhost:3001");
 *
 * const driver: Driver<IAgenticaRpcService> = connector.getDriver();
 * await driver.conversate("Hello, what you can do?");
 * ```
 *
 * @author Samchon
 */
export interface IAgenticaRpcListener {
  /**
   * Describe the function executions' results.
   *
   * Inform description message of the function execution's results from
   * the AI agent server to client.
   *
   * @param evt Event of a description of function execution results
   */
  describe(evt: IAgenticaEventJson.IDescribe): Promise<void>;

  /**
   * Text conversation message.
   *
   * @param evt Event of a text conversation message
   */
  text(evt: IAgenticaEventJson.IText): Promise<void>;

  /**
   * Initialize the AI agent.
   *
   * Informs an initialization of controller functions from
   * the AI agent server to client.
   *
   * @param evt Event of initialization
   */
  initialize?(evt: IAgenticaEventJson.IInitialize): Promise<void>;

  /**
   * Select a function to call.
   *
   * Informs a selected function to call from the AI agent server to client.
   *
   * @param evt Event of selecting a function to call
   */
  select?(evt: IAgenticaEventJson.ISelect): Promise<void>;

  /**
   * Cancel a function to call.
   *
   * Informs a canceling function to call from the AI agent server to client.
   *
   * @param evt Event of canceling a function to call
   */
  cancel?(evt: IAgenticaEventJson.ICancel): Promise<void>;

  /**
   * Call a function.
   *
   * Informs a function calling from the AI agent server to client.
   *
   * This event comes before the function execution, so that if you return
   * a different value from the original {@link IAgenticaEventJson.ICall.arguments},
   * you can modify the arguments of the function calling.
   *
   * Otherwise you do not return anything (`undefined`) or `null` value, the
   * arguments of the function calling would not be modified. Also, if you are
   * not interested in the function calling event, you can skit its
   * implementation.
   *
   * @param evt Event of a function calling
   * @return New arguments if you want to modify, otherwise null or undefined
   */
  call?(evt: IAgenticaEventJson.ICall): Promise<object | null | undefined>;

  /**
   * Executition of a function.
   *
   * Informs a function execution from the AI agent server to client.
   *
   * @param evt Event of a function execution
   */
  execute?(evt: IAgenticaEventJson.IExecute): Promise<void>;
}
