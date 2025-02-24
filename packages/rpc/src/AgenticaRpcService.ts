import { Agentica } from "@agentica/core";
import { Primitive } from "typia";

import { IAgenticaRpcListener } from "./IAgenticaRpcListener";
import { IAgenticaRpcService } from "./IAgenticaRpcService";

/**
 * RPC service for the {@link Agentica}.
 *
 * `AgenticaRpcService` is class defining an AI agent service
 * provided from the server to clients through the RPC (Remote Procedure Call)
 * paradigm in the websocket protocol.
 *
 * Client connecting to the `AgenticaRpcService` providing websocket server
 * will call the {@link conversate} function remotely through its basic
 * interface type {@link IAgenticaRpcService} with the RPC paradigm.
 *
 * Also, the client provides the {@link IAgenticaRpcListener} type to the
 * server, so that `AgenticaRpcService` will remotely call the
 * {@link IAgenticaRpcListener listener}'s functions internally.
 *
 * You can open the WebSocket server of the AI agent like below:
 *
 * ```typescript
 * import {
 *   IAgenticaRpcListener,
 *   IAgenticaRpcService,
 *   Agentica,
 *   AgenticaRpcService,
 * } from "@agentica/core";
 * import { WebSocketServer } from "tgrid";
 *
 * const server: WebSocketServer<
 *   null,
 *   IAgenticaRpcService,
 *   IAgenticaRpcListener
 * > = new WebSocketServer();
 * await server.open(3001, async (acceptor) => {
 *   await acceptor.accept(
 *     new AgenticaRpcService({
 *       agent: new Agentica({ ... }),
 *       listener: acceptor.getDriver(),
 *     }),
 *   );
 * });
 * ```
 *
 * @author Samchon
 */
export class AgenticaRpcService implements IAgenticaRpcService {
  /**
   * Initializer Constructor.
   *
   * @param props Properties to construct the RPC service
   */
  public constructor(private readonly props: AgenticaRpcService.IProps) {
    const { agent, listener } = props;

    // ESSENTIAL LISTENERS
    agent.on("text", (evt) => listener.text(primitive(evt)));
    agent.on("describe", (evt) => listener.describe(primitive(evt)));

    // OPTIONAL LISTENERS
    agent.on("initialize", (evt) => listener.initialize!(primitive(evt)));
    agent.on("select", (evt) => listener.select!(primitive(evt)));
    agent.on("cancel", (evt) => listener.cancel!(primitive(evt)));
    agent.on("call", async (evt) => {
      const args: object | null | undefined = await listener.call!(
        primitive(evt),
      );
      if (!!args) evt.arguments = args;
    });
    agent.on("execute", (evt) => listener.execute!(primitive(evt)));
  }

  /**
   * @inheritDoc
   */
  public async conversate(content: string): Promise<void> {
    await this.props.agent.conversate(content);
  }
}
export namespace AgenticaRpcService {
  /**
   * Properties of the {@link AgenticaRpcService}.
   */
  export interface IProps {
    /**
     * Target agent to provide as RPC service.
     */
    agent: Agentica;

    /**
     * Listener to be binded on the agent.
     */
    listener: IAgenticaRpcListener;
  }
}

/**
 * @internal
 */
const primitive = <T>(obj: T): Primitive<T> =>
  JSON.parse(JSON.stringify(obj)) as Primitive<T>;
