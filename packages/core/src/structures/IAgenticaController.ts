import type {
  IHttpConnection,
  IHttpLlmApplication,
  IHttpLlmFunction,
  IHttpResponse,
  ILlmApplication,
  ILlmFunction,
  IMcpLlmApplication,
} from "@samchon/openapi";

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
export type IAgenticaController =
  | IAgenticaController.IHttp
  | IAgenticaController.IClass
  | IAgenticaController.IMcp;

export namespace IAgenticaController {
  /**
   * HTTP controller.
   *
   * You can make it by {@link validateHttpLlmApplication} function with
   * the Swagger or OpenAPI document.
   */
  export interface IHttp extends IBase<"http", IHttpLlmApplication> {
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
  }

  /**
   * TypeScript class controller.
   *
   * You can make it by `typia.llm.application<App, Model>()` function.
   *
   * - https://typia.io/docs/llm/application
   */
  export interface IClass extends IBase<"class", ILlmApplication> {
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
        application: ILlmApplication;

        /**
         * Target function schema.
         */
        function: ILlmFunction;

        /**
         * Arguments of the function calling.
         */
        arguments: object;
      }) => Promise<unknown>);
  }

  /**
   * MCP Server controller.
   */
  export interface IMcp extends IBase<"mcp", IMcpLlmApplication> {
    /**
     * MCP client for connection.
     *
     * @warning You have to install `@modelcontextprotocol/sdk` package
     *          to use this type properly. If not, this type would work
     *          as an `any` type, so that you can't validate it.
     */
    // @ts-ignore Type checking only when `@modelcontextprotocol/sdk` is installed.
    //            This strategy is useful for someone who does not need MCP,
    //            for someone who has not installed `@modelcontextprotocol/sdk`.
    client: import("@modelcontextprotocol/sdk/client/index.d.ts").Client;
  }

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
