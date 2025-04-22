import type { Client } from "@modelcontextprotocol/sdk/client/index.d.ts";
import type { ILlmSchema, IMcpLlmApplication, IMcpTool } from "@samchon/openapi";

import { McpLlm } from "@samchon/openapi";
import typia from "typia";

import type { IAgenticaController } from "../structures/IAgenticaController";

/**
 * Create an MCP controller with type assertion.
 *
 * Create an {@link IAgenticaController.IMcp} instance which represents
 * an MCP (Model Context Protocol) controller with LLM function calling
 * schemas and client connection.
 *
 * @param props Properties to create the MCP controller
 * @param props.name Name of the MCP implementation.
 * @param props.client Client connection to the MCP implementation.
 * @param props.model Model schema of the LLM function calling.
 * @param props.options Options to create the MCP controller.
 * @returns MCP LLM application instance
 * @author Samchon
 */
export async function assertMcpController<Model extends ILlmSchema.Model>(props: {
  name: string;
  client: Client;
  model: Model;
  options?: Partial<IMcpLlmApplication.IOptions<Model>>;
}): Promise<IAgenticaController.IMcp<Model>> {
  // for peerDependencies
  const { ListToolsResultSchema } = await import("@modelcontextprotocol/sdk/types.js");

  // get list of tools
  const { tools } = await props.client.request({ method: "tools/list" }, ListToolsResultSchema);

  const application: IMcpLlmApplication<Model> = McpLlm.application<Model>({
    model: props.model,
    tools: typia.assert<Array<IMcpTool>>(tools),
  });

  return {
    protocol: "mcp",
    name: props.name,
    client: props.client,

    application,
  };
}
