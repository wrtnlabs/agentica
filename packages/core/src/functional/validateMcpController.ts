import type { Client } from "@modelcontextprotocol/sdk/client/index.d.ts";
import type { ILlmSchema, IMcpLlmApplication, IMcpTool, IValidation } from "@samchon/openapi";

import { McpLlm } from "@samchon/openapi";
import typia from "typia";

import type { IAgenticaController } from "../structures/IAgenticaController";

/**
 * Create an MCP controller with type validation.
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
 * @author SunRabbit
 */
export async function validateMcpController<
  Model extends ILlmSchema.Model
>(props: {
  name: string;
  client: Client;
  model: Model;
  options?: Partial<IMcpLlmApplication.IOptions<Model>>;
}): Promise<IValidation<IAgenticaController.IMcp<Model>>> {
  // for peerDependencies
  const { ListToolsResultSchema } = await import("@modelcontextprotocol/sdk/types.js");

  // get list of tools
  const { tools } = await props.client.request({ method: "tools/list" }, ListToolsResultSchema);
  const inspect = typia.validate<Array<IMcpTool>>(tools)
  if (inspect.success === false) {
    return inspect;
  }

  const application: IMcpLlmApplication<Model> = McpLlm.application<Model>({
    model: props.model,
    tools: typia.assert<Array<IMcpTool>>(tools),
  });

  return {
    success: true,
    data: {
      protocol: "mcp",
      name: props.name,
      client: props.client,
      application,
    },
  };
}