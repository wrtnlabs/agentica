import type { IAgenticaEventJson } from "./IAgenticaEventJson";

/**
 * Micro Agentic AI agent event.
 *
 * `IMicroAgenticaEventJson` is an union type of all possible events
 * that can be emitted by the A.I. chatbot of the {@link MicroAgentica}
 * class.
 *
 * You can discriminate the subtype by checking the {@link type} property.
 *
 * @author Samchon
 */
export type IMicroAgenticaEventJson =
  | IAgenticaEventJson.ICall
  | IAgenticaEventJson.IDescribe
  | IAgenticaEventJson.IExecute
  | IAgenticaEventJson.IInitialize
  | IAgenticaEventJson.IRequest
  | IAgenticaEventJson.IText
  | IAgenticaEventJson.IValidate;
