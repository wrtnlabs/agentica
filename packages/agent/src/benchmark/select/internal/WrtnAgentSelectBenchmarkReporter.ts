import { MathUtil } from "../../../internal/MathUtil";
import { IWrtnAgentSelectBenchmarkEvent } from "../IWrtnAgentSelectBenchmarkEvent";
import { IWrtnAgentSelectBenchmarkResult } from "../IWrtnAgentSelectBenchmarkResult";

/**
 * @internal
 */
export namespace WrtnAgentSelectBenchmarkReporter {
  export const markdown = (
    result: IWrtnAgentSelectBenchmarkResult,
  ): Record<string, string> =>
    Object.fromEntries([
      ["./README.md", writeIndex(result)],
      ...result.experiments
        .map((exp) => [
          [`./${exp.scenario.name}/README.md`, writeExperimentIndex(exp)],
          ...exp.events.map((event, i) => [
            `./${exp.scenario.name}/${i + 1}.${event.type}.md`,
            writeExperimentEvent(event, i),
          ]),
        ])
        .flat(),
    ]);

  const writeIndex = (result: IWrtnAgentSelectBenchmarkResult): string => {
    const events: IWrtnAgentSelectBenchmarkEvent[] = result.experiments
      .map((r) => r.events)
      .flat();
    const average: number =
      events
        .map((e) => e.completed_at.getTime() - e.started_at.getTime())
        .reduce((a, b) => a + b, 0) / events.length;
    return [
      "# LLM Function Selection Benchmark",
      "## Summary",
      `  - Aggregation:`,
      `    - Scenarios: #${result.experiments.length.toLocaleString()}`,
      `    - Trial: ${events.length}`,
      `    - Success: ${events.filter((e) => e.type === "success").length}`,
      `    - Failure: ${events.filter((e) => e.type === "failure").length}`,
      `    - Average Time: ${MathUtil.round(average).toLocaleString()} ms`,
      `  - Token Usage`,
      `    - Total: ${result.usage.total.toLocaleString()}`,
      `    - Prompt`,
      `      - Total: ${result.usage.prompt.total.toLocaleString()}`,
      `      - Audio: ${result.usage.prompt.audio.toLocaleString()}`,
      `      - Cached: ${result.usage.prompt.cached.toLocaleString()}`,
      `    - Completion:`,
      `      - Total: ${result.usage.completion.total.toLocaleString()}`,
      `      - Accepted Prediction: ${result.usage.completion.accepted_prediction.toLocaleString()}`,
      `      - Audio: ${result.usage.completion.audio.toLocaleString()}`,
      `      - Reasoning: ${result.usage.completion.reasoning.toLocaleString()}`,
      `      - Rejected Prediction: ${result.usage.completion.rejected_prediction.toLocaleString()}`,
      "",
      "## Experiments",
      " Name | Status | Time/Avg  ",
      ":-----|:-------|----------:",
      ...result.experiments.map((exp) =>
        [
          `[${exp.scenario.name}](./${exp.scenario.name}/README.md)`,
          (() => {
            const success: number = Math.floor(
              (exp.events.filter((e) => e.type === "success").length /
                exp.events.length) *
                10,
            );
            return (
              new Array(success).fill("■").join("") +
              new Array(10 - success).fill("□").join("")
            );
          })(),
          MathUtil.round(
            exp.events
              .map(
                (event) =>
                  event.completed_at.getTime() - event.started_at.getTime(),
              )
              .reduce((a, b) => a + b, 0) / exp.events.length,
          ).toLocaleString() + " ms",
        ].join(" | "),
      ),
    ].join("\n");
  };

  const writeExperimentIndex = (
    exp: IWrtnAgentSelectBenchmarkResult.IExperiment,
  ): string => {
    return [
      `# ${exp.scenario.name}`,
      "## Summary",
      "  - Aggregation:",
      `    - Trial: ${exp.events.length}`,
      `    - Success: ${exp.events.filter((e) => e.type === "success").length}`,
      `    - Failure: ${exp.events.filter((e) => e.type === "failure").length}`,
      `    - Average Time: ${MathUtil.round(
        exp.events
          .map(
            (event) =>
              event.completed_at.getTime() - event.started_at.getTime(),
          )
          .reduce((a, b) => a + b, 0) / exp.events.length,
      ).toLocaleString()} ms`,
      "  - Token Usage",
      `    - Total: ${exp.usage.total.toLocaleString()}`,
      `    - Prompt`,
      `      - Total: ${exp.usage.prompt.total.toLocaleString()}`,
      `      - Audio: ${exp.usage.prompt.audio.toLocaleString()}`,
      `      - Cached: ${exp.usage.prompt.cached.toLocaleString()}`,
      `    - Completion:`,
      `      - Total: ${exp.usage.completion.total.toLocaleString()}`,
      `      - Accepted Prediction: ${exp.usage.completion.accepted_prediction.toLocaleString()}`,
      `      - Audio: ${exp.usage.completion.audio.toLocaleString()}`,
      `      - Reasoning: ${exp.usage.completion.reasoning.toLocaleString()}`,
      `      - Rejected Prediction: ${exp.usage.completion.rejected_prediction.toLocaleString()}`,
      "",
      "## Events",
      " No | Type | Time",
      "---:|:-----|----:",
      ...exp.events.map((e, i) =>
        [
          `[${i + 1}.](./${i + 1}.${e.type}.md)`,
          e.type,
          MathUtil.round(e.completed_at.getTime() - e.started_at.getTime()) +
            " ms",
        ].join(" | "),
      ),
      "",
      "## Scenario",
      "### User Prompt",
      exp.scenario.text,
      "",
      ...exp.scenario.operations.map((op) =>
        [
          `### ${op.name}`,
          `  - Controller: ${op.controller.name}`,
          `  - Function: ${op.function.name}`,
          "",
          ...(op.function.description ? [op.function.description, ""] : []),
        ].join("\n"),
      ),
    ].join("\n");
  };

  const writeExperimentEvent = (
    event: IWrtnAgentSelectBenchmarkEvent,
    index: number,
  ): string => {
    return [
      `# ${index}. ${event.type}`,
      `## Summary`,
      `  - Name: ${event.scenario.name}`,
      `  - Type: ${event.type}`,
      `  - Time: ${(event.completed_at.getTime() - event.started_at.getTime()).toLocaleString()} ms`,
      ...(event.type !== "error"
        ? [
            "  - Token Usage",
            `    - Total: ${event.usage.total.toLocaleString()}`,
            `    - Prompt`,
            `      - Total: ${event.usage.prompt.total.toLocaleString()}`,
            `      - Audio: ${event.usage.prompt.audio.toLocaleString()}`,
            `      - Cached: ${event.usage.prompt.cached.toLocaleString()}`,
            `    - Completion:`,
            `      - Total: ${event.usage.completion.total.toLocaleString()}`,
            `      - Accepted Prediction: ${event.usage.completion.accepted_prediction.toLocaleString()}`,
            `      - Audio: ${event.usage.completion.audio.toLocaleString()}`,
            `      - Reasoning: ${event.usage.completion.reasoning.toLocaleString()}`,
            `      - Rejected Prediction: ${event.usage.completion.rejected_prediction.toLocaleString()}`,
          ]
        : []),
      "",
      ...(event.type === "success" || event.type === "failure"
        ? [
            "## Result",
            ...event.selected.map((s) =>
              [
                `### ${s.name}`,
                `  - Controller: ${s.controller.name}`,
                `  - Function: ${s.function.name}`,
                `  - Reason: ${s.reason}`,
                "",
                ...(s.function.description ? [s.function.description, ""] : []),
              ].join("\n"),
            ),
          ]
        : []),
      ...(event.type !== "error" && event.assistantPrompts.length > 0
        ? [
            "## Assistant Prompts",
            ...event.assistantPrompts.map((p) => p.text).join("\n\n"),
            "",
          ]
        : []),
      ...(event.type === "failure"
        ? [
            "## Expected",
            ...event.scenario.operations.map((op) =>
              [
                `### ${op.name}`,
                `  - Controller: ${op.controller.name}`,
                `  - Function: ${op.function.name}`,
                "",
                ...(op.function.description
                  ? [op.function.description, ""]
                  : []),
              ].join("\n"),
            ),
          ]
        : []),
      ...(event.type === "error"
        ? [
            "## Error",
            "```json",
            errorToJson(JSON.stringify(event.error, null, 2)),
            "```",
            "",
          ]
        : []),
    ].join("\n");
  };
}

const errorToJson = (error: any): any => {
  if (error instanceof Error)
    return {
      ...error,
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  return error;
};
