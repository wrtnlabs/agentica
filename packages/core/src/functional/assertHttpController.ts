import type { IHttpConnection, IHttpLlmApplication, IHttpLlmFunction, IHttpResponse, OpenApiV3, OpenApiV3_1, SwaggerV2 } from "@samchon/openapi";

import { HttpLlm, OpenApi } from "@samchon/openapi";
import typia from "typia";

import type { IAgenticaController } from "../structures/IAgenticaController";

/**
 * Create an HTTP controller with type assertion.
 *
 * Create an {@link IAgenticaController.IHttp} instance which represents
 * the HTTP controller from the given Swagger/OpenAPI document and the
 * target LLM model with connection information.
 *
 * By the way, even though this `assertHttpController` function
 * supports every version of Swagger/OpenAPI specification, there can
 * be a type error in the given document. In that case, the function
 * will throw an error with detailed type error tracing information.
 *
 * @param props Properties to create the HTTP controller instance
 * @returns HTTP controller instance
 * @throws {@link TypeGuardError} when the given document is invalid
 * @author Samchon
 */
export function assertHttpController(props: {
  /**
   * Name of the controller.
   */
  name: string;

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
   * Connection to the server.
   *
   * Connection to the API server including the URL and headers.
   */
  connection: IHttpConnection;

  /**
   * Options for the LLM function calling schema composition.
   */
  config?: Partial<IHttpLlmApplication.IConfig>;

  /**
   * Executor of the API function.
   *
   * @param props Properties of the API function call
   * @returns HTTP response of the API function call
   */
  execute?: (props: {
    /**
     * Connection to the server.
     */
    connection: IHttpConnection;

    /**
     * Application schema.
     */
    application: IHttpLlmApplication;

    /**
     * Function schema.
     */
    function: IHttpLlmFunction;

    /**
     * Arguments of the function calling.
     *
     * It is an object of key-value pairs of the API function's parameters.
     * The property keys are composed by below rules:
     *
     * - parameter names
     * - query parameter as an object type if exists
     * - body parameter if exists
     */
    arguments: object;
  }) => Promise<IHttpResponse>;
}): IAgenticaController.IHttp {
  const document = OpenApi.convert(typia.assert<
    | SwaggerV2.IDocument
    | OpenApiV3.IDocument
    | OpenApiV3_1.IDocument
    | OpenApi.IDocument
  >(props.document));
  return {
    protocol: "http",
    name: props.name,
    application: HttpLlm.application({
      document,
      config: props.config,
    }),
    execute: props.execute,
    connection: props.connection,
  };
}
