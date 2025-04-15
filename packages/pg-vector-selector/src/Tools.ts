import type { AgenticaContext } from "@agentica/core";

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

  select_function: {
    type: "function",
    function: {
      name: "select_function",

      parameters: {
        type: "object",
        properties: {
          function_name_list: {
            type: "array",
            description: "The list of functions to select.",
            items: {
              type: "object",
              properties: {
                reason: {
                  type: "string",
                  description: "The reason of the function selection.\n\nJust write the reason why you've determined to select this function.",
                },
                function_name: {
                  type: "string",
                  description: "Name of the target function to call.",
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
