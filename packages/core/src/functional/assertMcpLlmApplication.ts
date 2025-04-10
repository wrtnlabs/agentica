import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ListToolsResultSchema } from "@modelcontextprotocol/sdk/types.js";

import type { IMcpLlmApplication, IMcpLlmTransportProps } from "../structures/mcp";
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
export async function assertMcpLlmApplication(props: IMcpLlmTransportProps): Promise<IMcpLlmApplication> {
  const client = new Client({
    name: "get_tool_list",
    version: "1.0.0",
  });

  const transport = (() => {
    switch (props.type) {
      case "sse":
        return new SSEClientTransport(props.url);
      case "stdio":
        return new StdioClientTransport(props);
      default:
        props satisfies never;
        throw new Error("Invalid transport type");
    }
  })();
  await client.connect(transport);

  const toolList = await client.request({ method: "tools/list" }, ListToolsResultSchema);
  return {
    functions: toolList.tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.inputSchema,
    })),
    transport: props,
  };
}
