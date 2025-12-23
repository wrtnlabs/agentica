import type { IHttpLlmFunction, ILlmFunction, IMcpLlmFunction } from "@samchon/openapi";

import type { IAgenticaOperationJson } from "../json/IAgenticaOperationJson";
import type { IAgenticaController } from "../structures/IAgenticaController";

/**
 * Operation information in the Agentica Agent.
 *
 * `AgenticaOperation` is a type represents an operation that would
 * be selected by the A.I. chatbot of {@link Agentica} class to
 * perform the LLM (Large Language Model) function calling.
 *
 * Also, it is an union type that is discriminated by the {@link protocol}
 * property. If the protocol value is `http`, it means that the HTTP API
 * operation would be called by the A.I. chatbot. Otherwise, if the protocol
 * value is `class`, it means that the operation has come from a
 * TypeScript class.
 *
 * @author Samchon
 */
export type AgenticaOperation =
  | AgenticaOperation.Class
  | AgenticaOperation.Http
  | AgenticaOperation.Mcp;
export namespace AgenticaOperation {
  export type Class = Base<
    "class",
    IAgenticaController.IClass,
    ILlmFunction
  >;
  export type Http = Base<
    "http",
    IAgenticaController.IHttp,
    IHttpLlmFunction
  >;
  export type Mcp = Base<
    "mcp",
    IAgenticaController.IMcp,
    IMcpLlmFunction
  >;

  interface Base<
    Protocol extends "http" | "class" | "mcp",
    Controller extends object,
    Function extends object,
  > {
    /**
     * Protocol discriminator.
     */
    protocol: Protocol;

    /**
     * Belonged controller of the target function.
     */
    controller: Controller;

    /**
     * Target function to call.
     */
    function: Function;

    /**
     * Identifier name.
     */
    name: string;

    /**
     * Convert to primitive JSON object.
     */
    toJSON: () => IAgenticaOperationJson;
  }
}
