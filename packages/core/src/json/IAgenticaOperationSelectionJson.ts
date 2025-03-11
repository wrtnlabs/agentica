import { IAgenticaOperationJson } from "./IAgenticaOperationJson";

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
export interface IAgenticaOperationSelectionJson {
  reason: string;
  operation: IAgenticaOperationJson;
}
