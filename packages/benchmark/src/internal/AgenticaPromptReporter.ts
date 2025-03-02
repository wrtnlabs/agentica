import { IAgenticaPrompt } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

export namespace AgenticaPromptReporter {
  export const markdown = <Model extends ILlmSchema.Model>(
    p: IAgenticaPrompt<Model>,
  ): string => {
    if (p.type === "text")
      return [`### Text (${p.role})`, p.text, ""].join("\n");
    else if (p.type === "select" || p.type === "cancel")
      return [
        `### ${p.type === "select" ? "Select" : "Cancel"}`,
        ...p.operations
          .map((op) => [
            `#### ${op.name}`,
            `  - controller: ${op.controller.name}`,
            `  - function: ${op.function.name}`,
            `  - reason: ${op.reason}`,
            "",
            ...(!!op.function.description?.length
              ? [op.function.description, ""]
              : []),
          ])
          .flat(),
      ].join("\n");
    else if (p.type === "describe")
      return [
        "### Describe",
        ...p.executions.map((e) => `  - ${e.name}`),
        "",
        ...p.text.split("\n").map((s) => `> ${s}`),
        "",
      ].join("\n");
    return [
      "### Execute",
      `  - name: ${p.name}`,
      `  - controller: ${p.controller.name}`,
      `  - function: ${p.function.name}`,
      "",
      "```json",
      JSON.stringify(p.arguments, null, 2),
      "```",
      "",
    ].join("\n");
  };
}
