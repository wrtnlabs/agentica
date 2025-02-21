import { IWrtnAgentPrompt } from "../../module";

export namespace WrtnAgentPromptReporter {
  export const markdown = (p: IWrtnAgentPrompt): string => {
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
