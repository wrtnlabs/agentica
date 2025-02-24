import { IHttpLlmFunction } from "@samchon/openapi";
import { ILlmFunctionOfValidate } from "typia";

import { IAgenticaController } from "./IAgenticaController";

/**
 * Nestia agent operation selection.
 *
 * `IAgenticaOperationSelection` is a type represents an operation
 * which has been selected by the A.I. chatbot of {@link Agentica}
 * class for the LLM (Large Language Model) function calling with
 * detailed {@link reason} of the selection (or cancellation).
 *
 * Also, `IAgenticaOperationSelection` is an union type that can
 * specify a subtype by checking the {@link protocol} property.
 *
 * @author Samchon
 */
export type IAgenticaOperationSelection =
  | IAgenticaOperationSelection.IHttp
  | IAgenticaOperationSelection.IClass;
export namespace IAgenticaOperationSelection {
  export type IHttp = IBase<
    "http",
    IAgenticaController.IHttp,
    IHttpLlmFunction<"chatgpt">
  >;

  export type IClass = IBase<
    "class",
    IAgenticaController.IClass,
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
     * If {@link Agentica} has multiple {@link IAgenticaController}s,
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
