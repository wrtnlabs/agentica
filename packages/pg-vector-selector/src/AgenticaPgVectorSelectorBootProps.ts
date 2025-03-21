import type { IConnection } from "@wrtnlabs/connector-hive-api";

export interface IAgenticaPgVectorSelectorBootProps {
  connectorHiveConnection: IConnection;

  /**
   * @deprecated this option is experimental option
   */
  experimental?: {
    /**
     * @description The prompt for the select operation, already provide function list that searched by vector database.
     * @default "You are an AI assistant that selects and executes the most appropriate function(s) based on the current context, running the functions required by the context in the correct order. First, analyze the user's input or situation and provide a brief reasoning for why you chose the function(s) (one or more). Then, execute the selected function(s). If multiple functions are chosen, the order of execution follows the function call sequence, and the result may vary depending on this order. Return the results directly after execution. If clarification is needed, ask the user a concise question."
     */
    select_prompt?: string;
  };
  /**
   * @internal
   * @TODO apply options
   */
  _options?: {
    cache?: {
      version:
        | number
        | {
          [key: string]: number;
        };
    };
  };
}
