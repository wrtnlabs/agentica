import type { IMcpLlmFunction } from "./IMcpLlmFunction";

/**
 * MCP LLM application.
 */
export interface IMcpLlmApplication {
  /**
   * URL of the MCP server.
   */
  url: URL;

  /**
   * Version of the MCP server.
   */
  version: string;

  /**
   * Functions of the MCP server.
   */
  functions: IMcpLlmFunction[];
}
