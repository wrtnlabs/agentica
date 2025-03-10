import { Agentica, IAgenticaController } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";
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
export class AgenticaRpcService<Model extends ILlmSchema.Model>
  implements IAgenticaRpcService<Model>
{
  /**
   * Initializer Constructor.
   *
   * @param props Properties to construct the RPC service
   */
  public constructor(private readonly props: AgenticaRpcService.IProps<Model>) {
    const { agent, listener } = props;

    // ESSENTIAL LISTENERS
    agent.on("text", async (evt) =>
      listener.text(Object.assign(primitive(evt), { text: await evt.join() })),
    );
    agent.on("describe", async (evt) =>
      listener.describe(
        Object.assign(primitive(evt), { text: await evt.join() }),
      ),
    );

    // OPTIONAL LISTENERS
    agent.on("initialize", (evt) => listener.initialize!(primitive(evt)));
    agent.on("select", (evt) => listener.select!(primitive(evt)));
    agent.on("cancel", (evt) => listener.cancel!(primitive(evt)));
    agent.on("call", async (evt) => {
      const args: object | null | undefined = await listener.call!(
        primitive(evt),
      );
      if (args) evt.arguments = args;
    });
    agent.on("execute", (evt) => listener.execute!(primitive(evt as any)));
  }

  /**
   * @inheritDoc
   */
  public async conversate(content: string): Promise<void> {
    await this.props.agent.conversate(content);
  }

  /**
   * @inheritDoc
   */
  public async getControllers(): Promise<
    Primitive<IAgenticaController<Model>>[]
  > {
    return this.props.agent.getControllers() satisfies ReadonlyArray<
      IAgenticaController<Model>
    > as Primitive<IAgenticaController<Model>>[];
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

/**
 * @internal
 */
const primitive = <T>(obj: T): Primitive<T> =>
  JSON.parse(JSON.stringify(obj)) as Primitive<T>;
