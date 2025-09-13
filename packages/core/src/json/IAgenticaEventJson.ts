import type OpenAI from "openai";
import type { IValidation, tags } from "typia";

import type { AgenticaEventSource } from "../events/AgenticaEventSource";
import type { AgenticaUserMessageContent } from "../histories";

import type { IAgenticaHistoryJson } from "./IAgenticaHistoryJson";
import type { IAgenticaOperationJson } from "./IAgenticaOperationJson";
import type { IAgenticaOperationSelectionJson } from "./IAgenticaOperationSelectionJson";

/**
 * Agentic AI agent event.
 *
 * `IAgenticaEventJson` is an union type of all possible events that can
 * be emitted by the A.I. chatbot of the {@link Agentica} class.
 *
 * You can discriminate the subtype by checking the {@link type} property.
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
  | IAgenticaEventJson.IResponse
  | IAgenticaEventJson.ISelect
  | IAgenticaEventJson.IValidate
  | IAgenticaEventJson.IJsonParseError
  | IAgenticaEventJson.IAssistantMessage
  | IAgenticaEventJson.IUserMessage;

export namespace IAgenticaEventJson {
  export type Type = IAgenticaEventJson["type"];
  export interface Mapper {
    userMessage: IUserMessage;
    assistantMessage: IAssistantMessage;
    initialize: IInitialize;
    select: ISelect;
    cancel: ICancel;
    call: ICall;
    execute: IExecute;
    describe: IDescribe;
    request: IRequest;
    response: IResponse;
    validate: IValidate;
    jsonParseError: IJsonParseError;
  }

  /**
   * Event of assistant message.
   */
  export interface IAssistantMessage extends IBase<"assistantMessage"> {
    /**
     * Conversation text.
     */
    text: string;
  }

  /**
   * Event of user message.
   */
  export interface IUserMessage extends IBase<"userMessage"> {
    contents: Array<AgenticaUserMessageContent>;
  }

  /**
   * Event of initializing the chatbot.
   */
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

  export interface IValidate extends IBase<"validate"> {
    /**
     * Target operation to call.
     */
    operation: IAgenticaOperationJson;

    /**
     * Validation result as a failure.
     */
    result: IValidation.IFailure;

    life: number;
  }

  export interface IJsonParseError extends IBase<"jsonParseError"> {
    /**
     * Target operation to call.
     */
    operation: IAgenticaOperationJson;

    /**
     * Arguments of the function calling.
     *
     * The value represents the JSON string that failed to parse.
     */
    arguments: string;

    /**
     * Error message of the JSON parse error.
     */
    errorMessage: string;

    life: number;
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
    arguments: Record<string, unknown>;

    /**
     * Return value.
     */
    value: any;

    /**
     * Whether the execution was successful or not.
     *
     * If the success value is false, it means that an error has
     * occurred during the execution.
     */
    success: boolean;
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
    executes: IAgenticaHistoryJson.IExecute[];

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
     * Response body.
     */
    body: OpenAI.ChatCompletion;

    /**
     * Options for the request.
     */
    options?: OpenAI.RequestOptions | undefined;
  }

  interface IBase<Type extends string> {
    /**
     * Primary key of the event.
     */
    id: string;

    /**
     * Discriminator type.
     */
    type: Type;

    /**
     * Creation timestamp of the event.
     */
    created_at: string & tags.Format<"date-time">;
  }
}
