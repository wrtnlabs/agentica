import OpenAI from "openai";

import { AgenticaEventSource } from "../events/AgenticaEventSource";
import { IAgenticaOperationJson } from "./IAgenticaOperationJson";
import { IAgenticaOperationSelectionJson } from "./IAgenticaOperationSelectionJson";
import { IAgenticaPromptJson } from "./IAgenticaPromptJson";

/**
 * Nestia A.I. chatbot event.
 *
 * `IAgenticaEventJson` is an union type of all possible events that can
 * be emitted by the A.I. chatbot of the {@link Agentica} class. You
 * can discriminate the subtype by checking the {@link type} property.
 *
 * @author Samchon
 */
export type IAgenticaEventJson =
  | IAgenticaEventJson.ICall
  | IAgenticaEventJson.ICancel
  | IAgenticaEventJson.IDescribe
  | IAgenticaEventJson.IExecute
  | IAgenticaEventJson.IInitialize
  | IAgenticaEventJson.IRequest
  | IAgenticaEventJson.ISelect
  | IAgenticaEventJson.IText;
export namespace IAgenticaEventJson {
  export type Type = IAgenticaEventJson["type"];
  export type Mapper = {
    initialize: IInitialize;
    select: ISelect;
    cancel: ICancel;
    call: ICall;
    execute: IExecute;
    describe: IDescribe;
    text: IText;
    request: IRequest;
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
    selection: IAgenticaOperationSelectionJson;
  }

  /**
   * Event of canceling a function calling.
   */
  export interface ICancel extends IBase<"cancel"> {
    selection: IAgenticaOperationSelectionJson;
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
    operation: IAgenticaOperationJson;

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
    operation: IAgenticaOperationJson;

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
    executes: IAgenticaPromptJson.IExecute[];

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

  interface IBase<Type extends string> {
    /**
     * Discriminator type.
     */
    type: Type;
  }
}
