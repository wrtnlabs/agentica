import { AgenticaPrompt } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

export namespace AgenticaPromptReporter {
  export const markdown = <Model extends ILlmSchema.Model>(
    p: AgenticaPrompt<Model>,
  ): string => {
    if (p.type === "text")
      return [`### Text (${p.role})`, p.text, ""].join("\n");
    else if (p.type === "select" || p.type === "cancel")
      return [
        `### ${p.type === "select" ? "Select" : "Cancel"}`,
        ...p.selections
          .map((s) => [
            `#### ${s.operation.name}`,
            `  - controller: ${s.operation.controller.name}`,
            `  - function: ${s.operation.function.name}`,
            `  - reason: ${s.reason}`,
            "",
            ...(!!s.operation.function.description?.length
              ? [s.operation.function.description, ""]
              : []),
          ])
          .flat(),
      ].join("\n");
    else if (p.type === "describe")
      return [
        "### Describe",
        ...p.executions.map((e) => `  - ${e.operation.name}`),
        "",
        ...p.text.split("\n").map((s) => `> ${s}`),
        "",
      ].join("\n");
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
  };
}
