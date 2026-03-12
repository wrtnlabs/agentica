import typia, { ILlmApplication, IValidation } from "typia";

import type { IAgenticaController } from "../structures/IAgenticaController";
import { IMcpTool } from "../structures/IMcpTool";
import { createMcpLlmApplication } from "./createMcpLlmApplication";

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
export async function validateMcpController(props: {
  name: string;
  client: IAgenticaController.IMcp["client"];
  config?: Partial<ILlmApplication.IConfig>;
}): Promise<IValidation<IAgenticaController.IMcp>> {
  // for peerDependencies
  const { ListToolsResultSchema } = await import("@modelcontextprotocol/sdk/types.js");

  // get list of tools
  const { tools } = await props.client.request({ method: "tools/list" }, ListToolsResultSchema);
  const inspect = typia.validate<Array<IMcpTool>>(tools);
  if (inspect.success === false) {
    return inspect;
  }

  const application: ILlmApplication = createMcpLlmApplication({
    tools: typia.assert<Array<IMcpTool>>(tools),
    config: props.config,
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
