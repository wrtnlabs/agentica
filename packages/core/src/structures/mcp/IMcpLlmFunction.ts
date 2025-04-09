/**
 * MCP LLM function.
 */
export interface IMcpLlmFunction {
  /**
   * Name of the function.
   */
  name: string;

  /**
   * Description of the function.
   */
  description?: string;

  /**
   * Parameters of the function.
   */
  parameters: object;
}
