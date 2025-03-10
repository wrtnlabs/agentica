import { ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";

import { AgenticaEventSource } from "../events/AgenticaEventSource";
import { IAgenticaOperation } from "./IAgenticaOperation";
import { IAgenticaOperationSelection } from "./IAgenticaOperationSelection";
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
  export type Mapper = {
    initialize: IInitialize;
    select: ISelect;
    cancel: ICancel;
    call: ICall;
    execute: IExecute;
    describe: IDescribe;
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
    selection: IAgenticaOperationSelection;
  }

  /**
   * Event of canceling a function calling.
   */
  export interface ICancel extends IBase<"cancel"> {
    selection: IAgenticaOperationSelection;
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
    arguments: Record<string, any>;
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
    executions: IAgenticaPrompt.IExecute[];

    /**
     * Description text.
     */
    text: string;

    /**
     * Whether the streaming is completed or not.
     */
    done: boolean;
  }

  /**
   * Event of text message.
   */
  export interface IText extends IBase<"text"> {
    /**
     * Role of the orator.
     */
    role: "assistant" | "user";

    /**
     * Conversation text.
     */
    text: string;

    /**
     * Whether the streaming is completed or not.
     */
    done: boolean;
  }

  /**
   * Request event of LLM vendor API.
   */
  export interface IRequest extends IBase<"request"> {
    /**
     * The source agent of the request.
     */
    source: AgenticaEventSource;

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
    source: AgenticaEventSource;

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
