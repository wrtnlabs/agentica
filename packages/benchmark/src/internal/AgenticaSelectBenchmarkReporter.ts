import { AgenticaTokenUsage } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaSelectBenchmarkEvent } from "../structures/IAgenticaSelectBenchmarkEvent";
import { IAgenticaSelectBenchmarkResult } from "../structures/IAgenticaSelectBenchmarkResult";
import { MathUtil } from "../utils/MathUtil";
import { AgenticaBenchmarkUtil } from "./AgenticaBenchmarkUtil";

/**
 * @internal
 */
export namespace AgenticaSelectBenchmarkReporter {
  export const markdown = <Model extends ILlmSchema.Model>(
    result: IAgenticaSelectBenchmarkResult<Model>,
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

  const writeIndex = <Model extends ILlmSchema.Model>(
    result: IAgenticaSelectBenchmarkResult<Model>,
  ): string => {
    const events: IAgenticaSelectBenchmarkEvent<Model>[] = result.experiments
      .map((r) => r.events)
      .flat();
    const average: number =
      events
        .map((e) => e.completed_at.getTime() - e.started_at.getTime())
        .reduce((a, b) => a + b, 0) / events.length;
    const aggregate: AgenticaTokenUsage.IComponent = result.usage.aggregate;
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
      `    - Total: ${aggregate.total.toLocaleString()}`,
      `    - Input`,
      `      - Total: ${aggregate.input.total.toLocaleString()}`,
      `      - Cached: ${aggregate.input.cached.toLocaleString()}`,
      `    - Output:`,
      `      - Total: ${aggregate.output.total.toLocaleString()}`,
      `      - Accepted Prediction: ${aggregate.output.accepted_prediction.toLocaleString()}`,
      `      - Reasoning: ${aggregate.output.reasoning.toLocaleString()}`,
      `      - Rejected Prediction: ${aggregate.output.rejected_prediction.toLocaleString()}`,
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

  const writeExperimentIndex = <Model extends ILlmSchema.Model>(
    exp: IAgenticaSelectBenchmarkResult.IExperiment<Model>,
  ): string => {
    const aggregate: AgenticaTokenUsage.IComponent = exp.usage.aggregate;
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
      `  - Token Usage`,
      `    - Total: ${aggregate.total.toLocaleString()}`,
      `    - Input`,
      `      - Total: ${aggregate.input.total.toLocaleString()}`,
      `      - Cached: ${aggregate.input.cached.toLocaleString()}`,
      `    - Output:`,
      `      - Total: ${aggregate.output.total.toLocaleString()}`,
      `      - Accepted Prediction: ${aggregate.output.accepted_prediction.toLocaleString()}`,
      `      - Reasoning: ${aggregate.output.reasoning.toLocaleString()}`,
      `      - Rejected Prediction: ${aggregate.output.rejected_prediction.toLocaleString()}`,
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
      "### Expected",
      "```json",
      JSON.stringify(
        AgenticaBenchmarkUtil.expectedToJson(exp.scenario.expected),
        null,
        2,
      ),
      "```",
    ].join("\n");
  };

  const writeExperimentEvent = <Model extends ILlmSchema.Model>(
    event: IAgenticaSelectBenchmarkEvent<Model>,
    index: number,
  ): string => {
    return [
      `# ${index + 1}. ${event.type}`,
      `## Summary`,
      `  - Name: ${event.scenario.name}`,
      `  - Type: ${event.type}`,
      `  - Time: ${(event.completed_at.getTime() - event.started_at.getTime()).toLocaleString()} ms`,
      ...(event.type !== "error"
        ? [
            "  - Token Usage",
            `    - Total: ${event.usage.aggregate.toLocaleString()}`,
            `    - Prompt`,
            `      - Total: ${event.usage.aggregate.input.total.toLocaleString()}`,
            `      - Cached: ${event.usage.aggregate.input.cached.toLocaleString()}`,
            `    - Completion:`,
            `      - Total: ${event.usage.aggregate.output.total.toLocaleString()}`,
            `      - Reasoning: ${event.usage.aggregate.output.reasoning.toLocaleString()}`,
            `      - Accepted Prediction: ${event.usage.aggregate.output.accepted_prediction.toLocaleString()}`,
            `      - Rejected Prediction: ${event.usage.aggregate.output.rejected_prediction.toLocaleString()}`,
          ]
        : []),
      "",
      "## Scenario",
      "### User Prompt",
      event.scenario.text,
      "",
      "### Expected",
      "```json",
      JSON.stringify(
        AgenticaBenchmarkUtil.expectedToJson(event.scenario.expected),
        null,
        2,
      ),
      "```",
      "",
      ...(event.type === "success" || event.type === "failure"
        ? [
            "## Result",
            ...event.selected.map((s) =>
              [
                `### ${s.operation.name}`,
                `  - Controller: \`${s.operation.controller.name}\``,
                `  - Function: \`${s.operation.function.name}\``,
                `  - Reason: ${s.reason}`,
                "",
                ...(s.operation.function.description
                  ? [s.operation.function.description, ""]
                  : []),
              ].join("\n"),
            ),
          ]
        : []),
      ...(event.type === "error"
        ? [
            "## Error",
            "```json",
            AgenticaBenchmarkUtil.errorToJson(
              JSON.stringify(event.error, null, 2),
            ),
            "```",
            "",
          ]
        : []),
    ].join("\n");
  };
}
