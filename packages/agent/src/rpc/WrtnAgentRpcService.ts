import { Primitive } from "typia";

import { WrtnAgent } from "../WrtnAgent";
import { IWrtnAgentRpcListener } from "./IWrtnAgentRpcListener";
import { IWrtnAgentRpcService } from "./IWrtnAgentRpcService";

/**
 * RPC service for the {@link WrtnAgent}.
 *
 * `WrtnAgentRpcService` is class defining an AI agent service
 * provided from the server to clients through the RPC (Remote Procedure Call)
 * paradigm in the websocket protocol.
 *
 * Client connecting to the `WrtnAgentRpcService` providing websocket server
 * will call the {@link conversate} function remotely through its basic
 * interface type {@link IWrtnAgentRpcService} with the RPC paradigm.
 *
 * Also, the client provides the {@link IWrtnAgentRpcListener} type to the
 * server, so that `WrtnAgentRpcService` will remotely call the
 * {@link IWrtnAgentRpcListener listener}'s functions internally.
 *
 * You can open the WebSocket server of the AI agent like below:
 *
 * ```typescript
 * import {
 *   IWrtnAgentRpcListener,
 *   IWrtnAgentRpcService,
 *   WrtnAgent,
 *   WrtnAgentRpcService,
 * } from "@wrtnlabs/agent";
 * import { WebSocketServer } from "tgrid";
 *
 * const server: WebSocketServer<
 *   null,
 *   IWrtnAgentRpcService,
 *   IWrtnAgentRpcListener
 * > = new WebSocketServer();
 * await server.open(3001, async (acceptor) => {
 *   await acceptor.accept(
 *     new WrtnAgentRpcService({
 *       agent: new WrtnAgent({ ... }),
 *       listener: acceptor.getDriver(),
 *     }),
 *   );
 * });
 * ```
 *
 * @author Samchon
 */
export class WrtnAgentRpcService implements IWrtnAgentRpcService {
  /**
   * Initializer Constructor.
   *
   * @param props Properties to construct the RPC service
   */
  public constructor(private readonly props: WrtnAgentRpcService.IProps) {
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
export namespace WrtnAgentRpcService {
  /**
   * Properties of the {@link WrtnAgentRpcService}.
   */
  export interface IProps {
    /**
     * Target agent to provide as RPC service.
     */
    agent: WrtnAgent;

    /**
     * Listener to be binded on the agent.
     */
    listener: IWrtnAgentRpcListener;
  }
}

/**
 * @internal
 */
const primitive = <T>(obj: T): Primitive<T> =>
  JSON.parse(JSON.stringify(obj)) as Primitive<T>;
