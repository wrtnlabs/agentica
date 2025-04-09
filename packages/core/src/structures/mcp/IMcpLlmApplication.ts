import type { IMcpLlmFunction } from "./IMcpLlmFunction";
import type { IMcpLlmTransportProps } from "./IMcpLlmTransportProps";

/**
 * MCP LLM application.
 */
export interface IMcpLlmApplication {
  /**
   * Functions of the MCP server.
   */
  functions: IMcpLlmFunction[];

  /**
   * Transport properties of the MCP server.
   */
  transport: IMcpLlmTransportProps;
}
