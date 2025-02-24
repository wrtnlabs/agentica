import { IHttpLlmFunction } from "@samchon/openapi";
import { ILlmFunctionOfValidate } from "typia";

import { IAgenticaController } from "./IAgenticaController";

/**
 * Operation information in the Nestia Agent.
 *
 * `IAgenticaOperation` is a type represents an operation that would
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
export type IAgenticaOperation =
  | IAgenticaOperation.IHttp
  | IAgenticaOperation.IClass;
export namespace IAgenticaOperation {
  /**
   * HTTP API operation.
   */
  export type IHttp = IBase<
    "http",
    IAgenticaController.IHttp,
    IHttpLlmFunction<"chatgpt">
  >;

  /**
   * TypeScript class operation.
   */
  export type IClass = IBase<
    "class",
    IAgenticaController.IClass,
    ILlmFunctionOfValidate<"chatgpt">
  >;

  interface IBase<Protocol, Application, Function> {
    /**
     * Protocol discriminator.
     */
    protocol: Protocol;

    /**
     * Belonged controller of the target function.
     */
    controller: Application;

    /**
     * Target function to call.
     */
    function: Function;

    /**
     * Identifier name.
     */
    name: string;
  }
}
