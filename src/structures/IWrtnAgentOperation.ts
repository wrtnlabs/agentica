import { IHttpLlmFunction } from "@samchon/openapi";
import { ILlmFunctionOfValidate } from "typia";

import { IWrtnAgentController } from "./IWrtnAgentController";

/**
 * Operation information in the Nestia Agent.
 *
 * `IWrtnAgentOperation` is a type represents an operation that would
 * be selected by the A.I. chatbot of {@link WrtnAgent} class to
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
export type IWrtnAgentOperation =
  | IWrtnAgentOperation.IHttp
  | IWrtnAgentOperation.IClass;
export namespace IWrtnAgentOperation {
  /**
   * HTTP API operation.
   */
  export type IHttp = IBase<
    "http",
    IWrtnAgentController.IHttp,
    IHttpLlmFunction<"chatgpt">
  >;

  /**
   * TypeScript class operation.
   */
  export type IClass = IBase<
    "class",
    IWrtnAgentController.IClass,
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
