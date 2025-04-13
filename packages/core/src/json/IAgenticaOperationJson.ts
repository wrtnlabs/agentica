/**
 * Operation information in the Agentica Agent.
 *
 * `IAgenticaOperation` is a type represents an operation that would
 * be selected by the A.I. chatbot of {@link Agentica} class to
 * perform the LLM (Large Language Model) function calling.
 *
 * Also, it is an union type that is discriminated by the {@link protocol}
 * property. If the protocol value is `http`, it means that the HTTP API
 * operation would be called by the A.I. chatbot. Otherwise, if the protocol
 * value is `class`, it means that the operation has come from a
 * TypeScript class.
 *
 * @author Samchon
 */
export interface IAgenticaOperationJson {
  /**
   * Protocol discriminator.
   */
  protocol: "class" | "http" | "mcp";

  /**
   * Belonged controller of the target function.
   */
  controller: string;

  /**
   * Target function to call.
   */
  function: string;

  /**
   * Identifier name.
   */
  name: string;
}
