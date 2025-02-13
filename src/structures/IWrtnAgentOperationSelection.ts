import { IHttpLlmFunction } from "@samchon/openapi";
import { ILlmFunctionOfValidate } from "typia";

import { IWrtnAgentController } from "./IWrtnAgentController";

/**
 * Nestia agent operation selection.
 *
 * `IWrtnAgentOperationSelection` is a type represents an operation
 * which has been selected by the A.I. chatbot of {@link WrtnAgent}
 * class for the LLM (Large Language Model) function calling with
 * detailed {@link reason} of the selection (or cancellation).
 *
 * Also, `IWrtnAgentOperationSelection` is an union type that can
 * specify a subtype by checking the {@link protocol} property.
 *
 * @author Samchon
 */
export type IWrtnAgentOperationSelection =
  | IWrtnAgentOperationSelection.IHttp
  | IWrtnAgentOperationSelection.IClass;
export namespace IWrtnAgentOperationSelection {
  export type IHttp = IBase<
    "http",
    IWrtnAgentController.IHttp,
    IHttpLlmFunction<"chatgpt">
  >;

  export type IClass = IBase<
    "class",
    IWrtnAgentController.IClass,
    ILlmFunctionOfValidate<"chatgpt">
  >;

  interface IBase<Protocol, Controller, Function> {
    /**
     * Discriminator protocol.
     */
    protocol: Protocol;

    /**
     * Belonged controller of the target function.
     */
    controller: Controller;

    /**
     * Target function.
     *
     * Function that has been selected to prepare LLM function calling,
     * or canceled due to no more required.
     */
    function: Function;

    /**
     * Identifier name of the target function.
     *
     * If {@link WrtnAgent} has multiple {@link IWrtnAgentController}s,
     * the `name` can be different from target function's name.
     */
    name: string;

    /**
     * The reason of the function selection or cancellation.
     */
    reason: string;

    toJSON(): Omit<IBase<Protocol, string, string>, "toJSON">;
  }
}
