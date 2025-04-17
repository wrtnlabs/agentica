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

  select_functions: {
    type: "function",
    function: {
      name: "select_functions",
      description: `Select proper API functions to call.

If you A.I. agent has found some proper API functions to call
from the conversation with user, please select the API functions
just by calling this function.

When user wants to call a same function multiply, you A.I. agent must
list up it multiply in the \`functions\` property. Otherwise the user has
requested to call many different functions, you A.I. agent have to assign
them all into the \`functions\` property.

Also, if you A.I. agent can't specify a specific function to call due to lack
of specificity or homogeneity of candidate functions, just assign all of them
by in the \`functions\` property too. Instead, when you A.I. agent can specify
a specific function to call, the others would be eliminated.

@example
\`\`\`json
[
  {
    "reason": "The user wants to call the function multiply.",
    "function_name": "get_user_info"
  },
  {
    "reason": "The user wants to modify the user info.",
    "function_name": "modify_user_info"
  }
]
\`\`\`
`,
      parameters: {
        type: "object",
        properties: {
          function_list: {
            type: "array",
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
        required: ["function_list"],
      },
    },
  },
} satisfies Record<
  string,
  NonNullable<
    Parameters<AgenticaContext<"chatgpt">["request"]>[1]["tools"]
  >[number]
>;
