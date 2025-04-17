import type { AgenticaContext } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { factory, utils } from "@agentica/core";

import { Tools } from "./Tools";

export async function extractQuery<SchemaModel extends ILlmSchema.Model>(ctx: AgenticaContext<SchemaModel>) {
  const completionStream = await ctx.request("select", {
    messages: [
      {
        role: "developer",
        content: [
          "You are a function searcher. You will extract search queries from the user's message, and the query results will be function names.",
          "A query is a 2–3 sentence description of the action the user needs to perform.",
          "Therefore, the extracted queries must be suitable for function search.",
          "You should extract at least 7 queries.",
        ].join("\n"),
      },
      ...ctx.histories
        .map(factory.decodeHistory<SchemaModel>)
        .flat(),
      {
        role: "user",
        content: ctx.prompt.text,
      },
    ],
    tool_choice: "required",

    tools: [Tools.extract_query],
  });

  const chunks = await utils.StreamUtil.readAll(completionStream);
  const completion = utils.ChatGptCompletionMessageUtil.merge(chunks);
  const queries = completion.choices[0]?.message.tool_calls?.flatMap((v) => {
    const arg = JSON.parse(v.function.arguments) as { query?: string };
    const query = arg.query;
    if (typeof query !== "string") {
      return [];
    }
    return [query];
  }) ?? [];

  return queries;
}
