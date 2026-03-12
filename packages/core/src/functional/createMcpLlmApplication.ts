import type { IJsonSchemaTransformError, IResult } from "@typia/interface";
import type { ILlmApplication, ILlmFunction, ILlmSchema, OpenApi } from "typia";

import { LlmJson, LlmSchemaConverter, OpenApiConverter, OpenApiTypeChecker } from "@typia/utils";

import type { IMcpTool } from "../structures/IMcpTool";

export function createMcpLlmApplication(props: {
  tools: Array<IMcpTool>;
  config?: Partial<ILlmApplication.IConfig> | undefined;
}): ILlmApplication {
  const config: ILlmSchema.IConfig = LlmSchemaConverter.getConfig(props.config);
  const functions: ILlmFunction[] = [];

  props.tools.forEach((tool, i) => {
    // CONVERT TO EMENDED OPENAPI V3.1 SPECIFICATION
    const components: OpenApi.IComponents
      = OpenApiConverter.upgradeComponents({
        schemas: tool.inputSchema.$defs,
      });
    const schema: OpenApi.IJsonSchema = OpenApiConverter.upgradeSchema({
      components: {
        schemas: tool.inputSchema.$defs,
      },
      schema: tool.inputSchema,
    });
    if (components.schemas !== undefined) {
      const visited: Set<string> = new Set<string>();
      OpenApiTypeChecker.visit({
        closure: (schema: OpenApi.IJsonSchema) => {
          if (OpenApiTypeChecker.isReference(schema)) {
            visited.add(schema.$ref.split("/").pop()!);
          }
        },
        components,
        schema,
      });
      components.schemas = Object.fromEntries(
        Object.entries(components.schemas).filter(([key]) =>
          visited.has(key),
        ),
      );
    }

    // CONVERT TO LLM PARAMETERS
    const parameters: IResult<ILlmSchema.IParameters, IJsonSchemaTransformError>
      = LlmSchemaConverter.parameters({
        config,
        components,
        schema: schema as
        | OpenApi.IJsonSchema.IObject
        | OpenApi.IJsonSchema.IReference,
        accessor: `$input.tools[${i}].inputSchema`,
      });
    if (parameters.success === false) {
      return;
    }

    functions.push({
      name: tool.name,
      parameters: parameters.value,
      description: tool.description,
      validate: LlmJson.validate(parameters.value),
      parse: str => LlmJson.parse(str, parameters.value),
      coerce: input => LlmJson.coerce(input, parameters.value),
    });
  });
  return {
    functions,
    config: config as ILlmApplication.IConfig,
  };
}
