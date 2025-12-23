import type { IAgenticaController, MicroAgentica } from "@agentica/core";

import type { IAgenticaRpcService } from "./IAgenticaRpcService";
import type { IMicroAgenticaRpcListener } from "./IMicroAgenticaRpcListener";

/**
 * RPC service for the {@link MicroAgentica}.
 *
 * `MicroAgenticaRpcService` is class defining an AI agent service
 * provided from the server to clients through the RPC (Remote Procedure Call)
 * paradigm in the websocket protocol.
 *
 * Client connecting to the `MicroAgenticaRpcService` providing websocket server
 * will call the {@link conversate} function remotely through its basic
 * interface type {@link IAgenticaRpcService} with the RPC paradigm.
 *
 * Also, the client provides the {@link IMicroAgenticaRpcListener} type to the
 * server, so that `MicroAgenticaRpcService` will remotely call the
 * {@link IMicroAgenticaRpcListener listener}'s functions internally.
 *
 * You can open the WebSocket server of the AI agent like below:
 *
 * ```typescript
 * import {
 *   IMicroAgenticaRpcListener,
 *   IAgenticaRpcService,
 *   Agentica,
 *   MicroAgenticaRpcService,
 * } from "@agentica/core";
 * import { WebSocketServer } from "tgrid";
 *
 * const server: WebSocketServer<
 *   null,
 *   IAgenticaRpcService,
 *   IMicroAgenticaRpcListener
 * > = new WebSocketServer();
 * await server.open(3001, async (acceptor) => {
 *   await acceptor.accept(
 *     new MicroAgenticaRpcService({
 *       agent: new MicroAgentica({ ... }),
 *       listener: acceptor.getDriver(),
 *     }),
 *   );
 * });
 * ```
 *
 * @author Samchon
 */
export class MicroAgenticaRpcService
implements IAgenticaRpcService {
  /**
   * Initializer Constructor.
   *
   * @param props Properties to construct the RPC service
   */
  public constructor(private readonly props: MicroAgenticaRpcService.IProps) {
    const { agent, listener } = props;

    // ESSENTIAL LISTENERS
    agent.on("userMessage", async (evt) => {
      listener.userMessage!(evt.toJSON()).catch(() => {});
    });
    agent.on("assistantMessage", async (evt) => {
      await evt.join();
      listener.assistantMessage(evt.toJSON()).catch(() => {});
    });
    agent.on("describe", async (evt) => {
      await evt.join();
      listener.describe(evt.toJSON()).catch(() => {});
    });

    // OPTIONAL LISTENERS
    agent.on("call", async (evt) => {
      const args: object | null | undefined | void = await listener.call!(
        evt.toJSON(),
      );
      if (args != null) {
        evt.arguments = args;
      }
    });
    agent.on("execute", async (evt) => {
      listener.execute!(evt.toJSON()).catch(() => {});
    });
  }

  /**
   * @inheritDoc
   */
  public async conversate(content: string | Parameters<typeof MicroAgentica.prototype.conversate>[0]): Promise<void> {
    await this.props.agent.conversate(content);
  }

  /**
   * @inheritDoc
   */
  public async getControllers(): Promise<IAgenticaController[]> {
    return this.props.agent.getControllers() as IAgenticaController[];
  }
}
export namespace MicroAgenticaRpcService {
  /**
   * Properties to construct the RPC service.
   */
  export interface IProps {
    /**
     * AI agent to be controlled.
     */
    agent: MicroAgentica;

    /**
     * Listener to be notified.
     */
    listener: IMicroAgenticaRpcListener;
  }
}
