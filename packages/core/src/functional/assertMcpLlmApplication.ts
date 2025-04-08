import type { Client as McpClient } from "@modelcontextprotocol/sdk/client/index";

import import2 from "import2";

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
  const { Client } = await import2<{ Client: typeof McpClient }>("@modelcontextprotocol/sdk/client/index");
  const { SSEClientTransport } = await import2<typeof import("@modelcontextprotocol/sdk/client/sse")>("@modelcontextprotocol/sdk/client/sse");
  const { ListToolsResultSchema } = await import2<typeof import("@modelcontextprotocol/sdk/types")>("@modelcontextprotocol/sdk/types");

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
