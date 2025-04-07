import type {
  IHttpConnection,
  IHttpLlmApplication,
  IHttpLlmFunction,
  IHttpResponse,
  ILlmApplication,
  ILlmFunction,
  ILlmSchema,
} from "@samchon/openapi";

import type { IMcpLlmApplication } from "./IMcpLlmApplication";

/**
 * Controller of the Agentica Agent.
 *
 * `IAgenticaController` is a type represents a controller of the
 * {@link Agentica}, which serves a set of functions to be called
 * by A.I. chatbot from LLM function calling.
 *
 * Also, `IAgenticaController` is an union type which can specify
 * a subtype by checking the {@link protocol} property.
 *
 * - HTTP server: {@link IAgenticaController.IHttp}
 * - TypeScript class: {@link IAgenticaController.IClass}
 * - MCP Server: {@link IAgenticaController.IMcp}
 *
 * @author Samchon
 */
export type IAgenticaController<Model extends ILlmSchema.Model> =
  | IAgenticaController.IHttp<Model>
  | IAgenticaController.IClass<Model>
  | IAgenticaController.IMcp;

export namespace IAgenticaController {
  /**
   * HTTP controller.
   *
   * You can make it by {@link validateHttpLlmApplication} function with
   * the Swagger or OpenAPI document.
   */
  export interface IHttp<Model extends ILlmSchema.Model>
    extends IBase<"http", IHttpLlmApplication<Model>> {
    /**
     * Connection to the server.
     *
     * Connection to the API server including the URL and headers.
     */
    connection: IHttpConnection;

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
      application: IHttpLlmApplication<Model>;

      /**
       * Function schema.
       */
      function: IHttpLlmFunction<Model>;

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
  }

  /**
   * TypeScript class controller.
   *
   * You can make it by `typia.llm.application<App, Model>()` function.
   *
   * - https://typia.io/docs/llm/application
   */
  export interface IClass<Model extends ILlmSchema.Model>
    extends IBase<"class", ILlmApplication<Model>> {
    /**
     * Executor of the class function.
     *
     * Executor of the class function, by target class instance
     * or callback function with given schema and arguments
     * information.
     */
    execute:
      | object
      | ((props: {
        /**
         * Target application schema.
         */
        application: ILlmApplication<Model>;

        /**
         * Target function schema.
         */
        function: ILlmFunction<Model>;

        /**
         * Arguments of the function calling.
         */
        arguments: object;
      }) => Promise<unknown>);
  }

  /**
   * MCP Server controller.
   */
  export interface IMcp extends IBase<"mcp", IMcpLlmApplication> { }

  interface IBase<Protocol, Application> {
    /**
     * Protocol discrminator.
     */
    protocol: Protocol;

    /**
     * Name of the controller.
     */
    name: string;

    /**
     * Application schema of function calling.
     */
    application: Application;
  }
}
