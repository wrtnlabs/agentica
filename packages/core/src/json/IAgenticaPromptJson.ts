import { IAgenticaOperationJson } from "./IAgenticaOperationJson";
import { IAgenticaOperationSelectionJson } from "./IAgenticaOperationSelectionJson";

/**
 * Nestia A.I. chatbot prompt.
 *
 * `IWrtnChatPrompt` is an union type of all possible prompts that can
 * be generated by the A.I. chatbot of the {@link Agentica} class.
 *
 * In other words, `IWrtnChatPrompt` is a type of chat history that
 * is occurred during the conversation between the user and the A.I. chatbot
 * in the {@link Agentica} class.
 *
 * If you want to continue the previous A.I. chatbot session, you can
 * accomplish it by assigning the {@link IAgenticaProps.histories}
 * property when creating a new {@link Agentica} instance.
 *
 * @author Samchon
 */
export type IAgenticaPromptJson =
  | IAgenticaPromptJson.IText
  | IAgenticaPromptJson.ISelect
  | IAgenticaPromptJson.ICancel
  | IAgenticaPromptJson.IExecute
  | IAgenticaPromptJson.IDescribe;
export namespace IAgenticaPromptJson {
  /**
   * Select prompt.
   *
   * Selection prompt about candidate functions to call.
   */
  export interface ISelect extends IBase<"select"> {
    /**
     * ID of the LLM tool call result.
     */
    id: string;

    /**
     * Operations that have been selected.
     */
    selections: IAgenticaOperationSelectionJson[];
  }

  /**
   * Cancel prompt.
   *
   * Cancellation prompt about the candidate functions to be discarded.
   */
  export interface ICancel extends IBase<"cancel"> {
    /**
     * ID of the LLM tool call result.
     */
    id: string;

    /**
     * Operations that have been cancelled.
     */
    selections: IAgenticaOperationSelectionJson[];
  }

  /**
   * Execute prompt.
   *
   * Execution prompt about the LLM function calling.
   */
  export interface IExecute extends IBase<"execute"> {
    /**
     * ID of the LLM tool call result.
     */
    id: string;

    /**
     * Target operation to call.
     */
    operation: IAgenticaOperationJson;

    /**
     * Arguments of the LLM function calling.
     */
    arguments: Record<string, any>;

    /**
     * Return value.
     */
    value: any;
  }

  /**
   * Description prompt.
   *
   * Description prompt about the return value of the LLM function calling.
   */
  export interface IDescribe extends IBase<"describe"> {
    /**
     * Executions of the LLM function calling.
     *
     * This prompt describes the return value of them.
     */
    executions: IExecute[];

    /**
     * Description text.
     */
    text: string;
  }

  /**
   * Text prompt.
   */
  export interface IText<
    Role extends "assistant" | "user" = "assistant" | "user",
  > extends IBase<"text"> {
    /**
     * Role of the orator.
     */
    role: Role;

    /**
     * The text content.
     */
    text: string;
  }

  interface IBase<Type extends string> {
    /**
     * Discriminator type.
     */
    type: Type;
  }
}
