import { Client } from "@modelcontextprotocol/sdk/client/index";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types";

import type { IMcpLlmApplication } from "../structures/IMcpLlmApplication";

/**
 * Create an MCP LLM application instance with type assertion.
 *
 * Create an {@link IMcpLlmApplication} instance which represents
 * an MCP (Model Context Protocol) LLM application.
 *
 * @param props Properties to create the MCP LLM application instance
 * @param props.name Name of the MCP implementation.
 * @param props.url URL of the MCP server.
 * @param props.version Describes version of an MCP implementation.
 * @returns MCP LLM application instance
 * @author Samchon
 */
export async function assertMcpLlmApplication(props: {
  /**
   * Name of the MCP implementation.
   */
  name: string;

  /**
   * URL of the MCP server.
   */
  url: URL;
  /**
   * Describes version of an MCP implementation.
   */
  version: string;
}): Promise<IMcpLlmApplication> {
  const client = new Client({
    name: props.name,
    version: props.version,
  });

  const transport = new SSEClientTransport(props.url);
  await client.connect(transport);

  const toolList = await client.request({ method: "tools/list" }, ListToolsResultSchema);

  return {
    url: props.url,
    version: props.version,
    functions: toolList.tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    })),
  };
}
