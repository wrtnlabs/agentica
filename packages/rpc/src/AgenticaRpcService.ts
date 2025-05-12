import type { Agentica, IAgenticaController } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaRpcListener } from "./IAgenticaRpcListener";
import type { IAgenticaRpcService } from "./IAgenticaRpcService";

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
export class AgenticaRpcService<Model extends ILlmSchema.Model>
implements IAgenticaRpcService<Model> {
  /**
   * Initializer Constructor.
   *
   * @param props Properties to construct the RPC service
   */
  public constructor(private readonly props: AgenticaRpcService.IProps<Model>) {
    const { agent, listener } = props;

    // ESSENTIAL LISTENERS
    agent.on("userMessage", async (event) => {
      listener.userMessage!(event.toJSON()).catch(() => {});
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
    agent.on("initialize", async (evt) => {
      listener.initialize!(evt.toJSON()).catch(() => {});
    });
    agent.on("select", async (evt) => {
      listener.select!(evt.toJSON()).catch(() => {});
    });
    agent.on("cancel", async (evt) => {
      listener.cancel!(evt.toJSON()).catch(() => {});
    });
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
  public async conversate(content: string | Parameters<typeof Agentica.prototype.conversate>[0]): Promise<void> {
    await this.props.agent.conversate(content);
  }

  /**
   * @inheritDoc
   */
  public async getControllers(): Promise<IAgenticaController<Model>[]> {
    return this.props.agent.getControllers() as IAgenticaController<Model>[];
  }
}
export namespace AgenticaRpcService {
  /**
   * Properties of the {@link AgenticaRpcService}.
   */
  export interface IProps<Model extends ILlmSchema.Model> {
    /**
     * Target agent to provide as RPC service.
     */
    agent: Agentica<Model>;

    /**
     * Listener to be binded on the agent.
     */
    listener: IAgenticaRpcListener;
  }
}
