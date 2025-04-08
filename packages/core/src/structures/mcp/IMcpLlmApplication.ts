import type { IMcpLlmFunction } from "./IMcpLlmFunction";
import type { IMcpLlmTransportProps } from "./IMcpLlmTransportProps";

/**
 * MCP LLM application.
 */
export interface IMcpLlmApplication {
  /**
   * Name of the MCP server.
   */
  name: string;

  /**
   * Version of the MCP server.
   */
  version: string;

  /**
   * Functions of the MCP server.
   */
  functions: IMcpLlmFunction[];

  /**
   * Transport properties of the MCP server.
   */
  transport: IMcpLlmTransportProps;
}
