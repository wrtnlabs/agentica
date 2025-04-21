import type { AgenticaContext } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { FromSchema } from "json-schema-to-ts";

import { factory, utils } from "@agentica/core";

import { Tools } from "./Tools";
import { reportStorage } from "./tracking";

export async function extractQuery<SchemaModel extends ILlmSchema.Model>(ctx: AgenticaContext<SchemaModel>) {
  const completionStream = await ctx.request("select", {
    messages: [
      {
        role: "system",
        content: [
          "You are a function searcher. You will extract search queries from the user's message, and the query results will be function names.",
          "A query is a 2–3 sentence description of the action the user needs to perform.",
          "Therefore, the extracted queries must be suitable for function search.",
          "You need to identify the actions required to achieve what the user wants and extract queries that can be used to search for those actions.",
          "Extract only one query per task.",
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
    const arg = JSON.parse(v.function.arguments) as Partial<FromSchema<typeof Tools.extract_query.function.parameters>>;
    if (!Array.isArray(arg.query_list)) {
      return [];
    }

    return arg.query_list.map(v => v.query);
  }) ?? [];

  return queries;
}
