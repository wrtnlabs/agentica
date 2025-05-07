import type {
  IHttpLlmApplication,
  ILlmSchema,
  OpenApiV3,
  OpenApiV3_1,
  SwaggerV2,
} from "@samchon/openapi";
import type { IValidation } from "typia";

import {
  HttpLlm,
  OpenApi,
} from "@samchon/openapi";
import typia from "typia";

/**
 * Create an HTTP LLM application instance with type validation.
 *
 * Create an {@link IHttpLlmApplication} instance which represents
 * the LLM (Large Language Model) function calling application schema
 * from the given Swagger/OpenAPI document and the target LLM model.
 *
 * By the way, even though this `validateHttpLlmApplication` function
 * supports every version of Swagger/OpenAPI specification, there can
 * be a type error in the given document. In that case, the function
 * will return {@link IValidation.IFailure} instance with detailed
 * type error tracing information.
 *
 * @param props Properties to create the HTTP LLM application instance
 * @returns Validation result of the HTTP LLM application composition
 * @author Samchon
 * @deprecated Use {@link validateHttpController} instead.
 */
export function validateHttpLlmApplication<
  Model extends ILlmSchema.Model,
>(props: {
  /**
   * Target LLM model.
   */
  model: Model;

  /**
   * Swagger/OpenAPI document.
   */
  document:
    | SwaggerV2.IDocument
    | OpenApiV3.IDocument
    | OpenApiV3_1.IDocument
    | OpenApi.IDocument
    | unknown;

  /**
   * Options for the LLM function calling schema composition.
   */
  options?: Partial<IHttpLlmApplication.IOptions<Model>>;
}): IValidation<IHttpLlmApplication<Model>> {
  const inspect: IValidation<
    | SwaggerV2.IDocument
    | OpenApiV3.IDocument
    | OpenApiV3_1.IDocument
    | OpenApi.IDocument
  > = typia.validate<
    | SwaggerV2.IDocument
    | OpenApiV3.IDocument
    | OpenApiV3_1.IDocument
    | OpenApi.IDocument
  >(props.document);
  if (inspect.success === false) {
    return inspect;
  }
  return {
    success: true,
    data: HttpLlm.application({
      model: props.model,
      document: OpenApi.convert(inspect.data),
      options: props.options,
    }),
  };
}
