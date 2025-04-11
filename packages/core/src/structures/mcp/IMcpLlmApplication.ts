import type { Client } from "@modelcontextprotocol/sdk/client/index.d.ts";

import type { IMcpLlmFunction } from "./IMcpLlmFunction";
/**
 * MCP LLM application.
 */
export interface IMcpLlmApplication {
  client: Client;
  functions: IMcpLlmFunction[];
}
