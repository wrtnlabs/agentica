import { IHttpLlmFunction, ILlmFunction, ILlmSchema } from "@samchon/openapi";

import { IAgenticaOperation } from "../json/IAgenticaOperation";
import { IAgenticaController } from "../structures/IAgenticaController";

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
export type AgenticaOperation<Model extends ILlmSchema.Model> =
  | AgenticaOperation.Class<Model>
  | AgenticaOperation.Http<Model>;
export namespace AgenticaOperation {
  export type Class<Model extends ILlmSchema.Model> = Base<
    "class",
    IAgenticaController.IClass<Model>,
    ILlmFunction<Model>
  >;
  export type Http<Model extends ILlmSchema.Model> = Base<
    "http",
    IAgenticaController.IHttp<Model>,
    IHttpLlmFunction<Model>
  >;

  interface Base<
    Protocol extends "http" | "class",
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
    toJSON(): IAgenticaOperation;
  }
}
