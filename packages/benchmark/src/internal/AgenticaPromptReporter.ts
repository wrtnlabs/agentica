/**
 * @module
 * This file contains functions to work with AgenticaPromptReporter.
 *
 * @author Wrtn Technologies
 */
import type { AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

export const AgenticaPromptReporter = {
  markdown,
};

function markdown<Model extends ILlmSchema.Model>(p: AgenticaHistory<Model>): string {
  // @TODO use switch statement
  if (p.type === "text") {
    return [`### Text (${p.role})`, p.text, ""].join("\n");
  }
  else if (p.type === "select" || p.type === "cancel") {
    return [
      `### ${p.type === "select" ? "Select" : "Cancel"}`,
      ...p.selections
        .flatMap((s) => {
          const functionDescriptionCount = s.operation.function.description?.length ?? 0;

          return [
            `#### ${s.operation.name}`,
            `  - controller: ${s.operation.controller.name}`,
            `  - function: ${s.operation.function.name}`,
            `  - reason: ${s.reason}`,
            "",
            ...(functionDescriptionCount > 0
              ? [s.operation.function.description, ""]
              : []),
          ];
        }),
    ].join("\n");
  }
  else if (p.type === "describe") {
    return [
      "### Describe",
      ...p.executes.map(e => `  - ${e.operation.name}`),
      "",
      ...p.text.split("\n").map(s => `> ${s}`),
      "",
    ].join("\n");
  }
  return [
    "### Execute",
    `  - name: ${p.operation.name}`,
    `  - controller: ${p.operation.controller.name}`,
    `  - function: ${p.operation.function.name}`,
    "",
    "```json",
    JSON.stringify(p.arguments, null, 2),
    "```",
    "",
  ].join("\n");
}
