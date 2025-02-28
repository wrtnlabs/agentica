import { IAgenticaController } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";
import { Primitive } from "typia";

/**
 * RPC interface of AI agent service.
 *
 * `IAgenticaRpcService` is an interface defining an AI agent service
 * provided from the server to client through the RPC (Remote Procedure Call)
 * paradigm in the websocket protocol.
 *
 * The client will call the {@link conversate} function remotely, and the
 * server responses to the client by calling the client's
 * {@link IAgenticaRpcListener} functions remotely too.
 *
 * @author Samchon
 */
export interface IAgenticaRpcService<Model extends ILlmSchema.Model> {
  /**
   * Conversate with the AI agent.
   *
   * User talks to the AI agent with the content.
   *
   * When AI agent responds some actions like conversating or executing
   * LLM (Large Language Model) function calling, the functions defined in the
   * {@link IAgenticaRpcListener} would be called through the RPC
   * (Remote Procedure Call) paradigm.
   *
   * @param content The content to talk
   * @returns Returned when the conversation process is completely done
   */
  conversate(content: string): Promise<void>;

  /**
   * Get controllers.
   *
   * Get controllers, collection of functions that would be
   * called by the AI chatbot.
   */
  getControllers(): Promise<Primitive<IAgenticaController<Model>[]>>;
}
