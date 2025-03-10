import { ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";

import { AgenticaSource } from "../typings/AgenticaSource";
import { IAgenticaOperation } from "./IAgenticaOperation";
import { IAgenticaPrompt } from "./IAgenticaPrompt";

/**
 * Nestia A.I. chatbot event.
 *
 * `IAgenticaEvent` is an union type of all possible events that can
 * be emitted by the A.I. chatbot of the {@link Agentica} class. You
 * can discriminate the subtype by checking the {@link type} property.
 *
 * @author Samchon
 */
export type IAgenticaEvent<Model extends ILlmSchema.Model> =
  | IAgenticaEvent.IInitialize
  | IAgenticaEvent.ISelect
  | IAgenticaEvent.ICancel
  | IAgenticaEvent.ICall
  | IAgenticaEvent.IExecute
  | IAgenticaEvent.IDescribe
  | IAgenticaEvent.IText
  | IAgenticaEvent.IRequest
  | IAgenticaEvent.IResponse;
export namespace IAgenticaEvent {
  export type Type = IAgenticaEvent<any>["type"];
  export type Mapper<Model extends ILlmSchema.Model> = {
    initialize: IInitialize;
    select: ISelect<Model>;
    cancel: ICancel<Model>;
    call: ICall<Model>;
    execute: IExecute<Model>;
    describe: IDescribe<Model>;
    text: IText;
    request: IRequest;
    response: IResponse;
  };

  /**
   * Event of initializing the chatbot.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface IInitialize extends IBase<"initialize"> {}

  /**
   * Event of selecting a function to call.
   */
  export interface ISelect extends IBase<"select"> {
    reason: string;
    operation: IAgenticaOperation;
  }

  /**
   * Event of canceling a function calling.
   */
  export interface ICancel extends IBase<"cancel"> {
    /**
     * Selected operation to cancel.
     *
     * Operation that has been selected to prepare LLM function calling,
     * but canceled due to no more required.
     */
    operation: IAgenticaOperation;

    /**
     * Reason of selecting the function.
     *
     * The A.I. chatbot will fill this property describing why the function
     * has been cancelled.
     *
     * For reference, if the A.I. chatbot successfully completes the LLM
     * function calling, the reason of the function cancellation will be
     * "complete".
     */
    reason: string;
  }

  /**
   * Event of calling a function.
   */
  export interface ICall extends IBase<"call"> {
    /**
     * ID of the tool calling.
     */
    id: string;

    /**
     * Target operation to call.
     */
    operation: IAgenticaOperation;

    /**
     * Arguments of the function calling.
     *
     * If you modify this {@link arguments} property, it actually modifies
     * the backend server's request. Therefore, be careful when you're
     * trying to modify this property.
     */
    arguments: object;
  }

  /**
   * Event of function calling execution.
   */
  export interface IExecute extends IBase<"execute"> {
    /**
     * ID of the tool calling.
     */
    id: string;

    /**
     * Target operation had called.
     */
    operation: IAgenticaOperation;

    /**
     * Arguments of the function calling.
     */
    arguments: object;

    /**
     * Return value.
     */
    value: any;
  }

  /**
   * Event of description.
   *
   * Event describing return values of LLM function callings.
   */
  export interface IDescribe extends IBase<"describe"> {
    /**
     * Executions of the LLM function calling.
     *
     * This prompt describes the return value of them.
     */
    executions: IAgenticaPrompt.IExecute<Model>[];

    /**
     * Description text stream.
     */
    stream: ReadableStream<string>;

    /**
     * Get the description text.
     */
    join: () => Promise<string>;
  }

  /**
   * Event of text message.
   */
  export interface IText extends IBase<"text"> {
    /**
     * Role of the orator.
     */
    role: "assistant" | "user";

    text: string;

    // /**
    //  * Description text stream.
    //  */
    // stream: ReadableStream<string>;

    // /**
    //  * Get the description text.
    //  */
    // join: () => Promise<string>;
  }

  /**
   * Request event of LLM vendor API.
   */
  export interface IRequest extends IBase<"request"> {
    /**
     * The source agent of the request.
     */
    source: AgenticaSource;

    /**
     * Request body.
     */
    body: OpenAI.ChatCompletionCreateParamsStreaming;

    /**
     * Options for the request.
     */
    options?: OpenAI.RequestOptions | undefined;
  }

  /**
   * Response event of LLM vendor API.
   */
  export interface IResponse extends IBase<"response"> {
    /**
     * The source agent of the response.
     */
    source: AgenticaSource;

    /**
     * Request body.
     */
    body: OpenAI.ChatCompletionCreateParamsStreaming;

    /**
     * Options for the request.
     */
    options?: OpenAI.RequestOptions | undefined;
    /**
     * The text content stream.
     */
    stream: ReadableStream<OpenAI.ChatCompletionChunk>;

    /**
     * Get the description text.
     */
    join: () => Promise<OpenAI.ChatCompletion>;
  }

  interface IBase<Type extends string> {
    /**
     * Discriminator type.
     */
    type: Type;
  }
}
