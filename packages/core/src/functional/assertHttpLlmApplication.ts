import type {
  IHttpLlmApplication,
  OpenApiV3,
  OpenApiV3_1,
  SwaggerV2,
} from "@samchon/openapi";

import {
  HttpLlm,
  OpenApi,
} from "@samchon/openapi";
import typia from "typia";

/**
 * Create an HTTP LLM application instance with type assertion.
 *
 * Create an {@link IHttpLlmApplication} instance which represents
 * the LLM (Large Language Model) function calling application schema
 * from the given Swagger/OpenAPI document and the target LLM model.
 *
 * By the way, even though this `assertHttpLlmApplication` function
 * supports every version of Swagger/OpenAPI specification, there can
 * be a type error in the given document. In that case, the function
 * will throw an error with detailed type error tracing information.
 *
 * @param props Properties to create the HTTP LLM application instance
 * @returns  HTTP LLM application instance
 * @throws {@link TypeGuardError} when the given document is invalid
 * @author Samchon
 * @deprecated Use {@link assertHttpController} instead.
 */
export function assertHttpLlmApplication(props: {
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
  config?: Partial<IHttpLlmApplication.IConfig>;
}): IHttpLlmApplication {
  return HttpLlm.application({
    document: OpenApi.convert(typia.assert<
      | SwaggerV2.IDocument
      | OpenApiV3.IDocument
      | OpenApiV3_1.IDocument
      | OpenApi.IDocument
    >(props.document)),
    config: props.config,
  });
}
