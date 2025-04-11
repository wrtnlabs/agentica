import type { IMcpLlmApplication } from "../structures/mcp";
import type { Client } from "@modelcontextprotocol/sdk/client/index.d.ts";
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
  client: Client;
}
): Promise<IMcpLlmApplication> {
  // for peerDependencies
  const { ListToolsResultSchema } = await import("@modelcontextprotocol/sdk/types.js");

  const toolList = await props.client.request({ method: "tools/list" }, ListToolsResultSchema);
  return {
    functions: toolList.tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    })),
    client: props.client,
  };
}
