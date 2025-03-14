import { AgenticaContext } from "@agentica/core";

export const Tools = {
  extract_query: {
    type: "function",
    function: {
      name: "extract_search_query",
      description: "extract search query from user message",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "the search query",
          },
        },
        required: ["query"],
      },
    },
  },

  execute_function: {
    type: "function",
    function: {
      name: "execute_function",
      description: "execute the function",
      parameters: {
        type: "object",
        properties: {
          function_name_list: {
            type: "array",
            description: "the function to execute",
            items: {
              type: "object",
              properties: {
                reason: {
                  type: "string",
                  description: "the reason for executing the function",
                },
                function_name: {
                  type: "string",
                  description: "the name of the function to execute",
                },
              },
              required: ["reason", "function_name"],
            },
          },
        },
        required: ["function_name_list"],
      },
    },
  },
} satisfies Record<
  string,
  NonNullable<
    Parameters<AgenticaContext<"chatgpt">["request"]>[1]["tools"]
  >[number]
>;
