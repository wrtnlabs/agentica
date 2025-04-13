import type { IAgenticaHistoryJson } from "./IAgenticaHistoryJson";

/**
 * Micro Agentic AI agent prompt.
 *
 * `IMicroAgenticaPromptJson` is an union type of all possible prompts
 * that can be generated by the AI chatbot of the {@link MicroAgentica}
 * class.
 *
 * In other words, `IMicroAgenticaPromptJson` is a type of chat history
 * that is occurred during the conversation between the user and the
 * AI chatbot in the {@link MicroAgentica} class.
 *
 * If you want to continue the previous A.I. chatbot session, you can
 * accomplish it by assigning the {@link IMicroAgenticaProps.histories}
 * property when creating a new {@link MicroAgentica} instance.
 *
 * @author Samchon
 */
export type IMicroAgenticaHistoryJson =
  | IAgenticaHistoryJson.IText
  | IAgenticaHistoryJson.IExecute
  | IAgenticaHistoryJson.IDescribe;
