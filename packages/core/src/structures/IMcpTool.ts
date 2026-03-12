import type { OpenApiV3_2 } from "@typia/interface";

/**
 * MCP tool type.
 *
 * `IMcpTool` is an interface representing a tool type defined in the MCP (Model
 * Context Protocol).
 *
 * Note that, don't be confused with {@link IMcpLlmFunction} type, that is used
 * for {@link McpLlm.application} which converts this `IMcpTool` type to the
 * {@link IMcpLlmFunction} type.
 *
 * @author Samchon
 * @warning Don't be confused with {@link IMcpLlmFunction}
 */
export interface IMcpTool {
  /**
   * Name of the tool.
   *
   * @maxLength 64
   */
  name: string;

  /** Description of the tool. */
  description?: string | undefined;

  /**
   * Input schema of the tool.
   *
   * The input schema, parameters of the tool.
   *
   * As MCP (Model Context Protocol) does not restrict the JSON schema
   * specification, `@samchon/openapi` has defined it to be universal structure
   * {@link OpenApiV3_1.IJsonSchema} which can cover every JSON schema
   * specification.
   */
  inputSchema: IMcpTool.IParameters;

  outputSchema?: IMcpTool.IParameters | undefined;
}
export namespace IMcpTool {

  /**
   * Input and output schema of the tool.
   *
   * The input and output schemas, parameters of the tool.
   *
   * As MCP (Model Context Protocol) does not restrict the JSON schema
   * specification, `@typia/interface` has defined it to be universal structure
   * {@link OpenApiV3_2.IJsonSchema} which can cover every JSON schema
   * specification.
   */
  export type IParameters = (
    | OpenApiV3_2.IJsonSchema.IObject
    | OpenApiV3_2.IJsonSchema.IReference
  ) & {
    /** Collection of the named schemas. */
    $defs?: Record<string, OpenApiV3_2.IJsonSchema>;
  };
}
