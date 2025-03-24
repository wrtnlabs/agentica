/**
 * @module
 * This file contains functions to work with AgenticaCallBenchmarkReporter.
 *
 * @author Wrtn Technologies
 */
import type { AgenticaTokenUsage } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaCallBenchmarkEvent } from "../structures/IAgenticaCallBenchmarkEvent";
import type { IAgenticaCallBenchmarkResult } from "../structures/IAgenticaCallBenchmarkResult";
import { MathUtil } from "../utils/MathUtil";
import { AgenticaBenchmarkUtil } from "./AgenticaBenchmarkUtil";
import { AgenticaPromptReporter } from "./AgenticaPromptReporter";

export const AgenticaCallBenchmarkReporter = {
  markdown,
};

export function markdown<Model extends ILlmSchema.Model>(result: IAgenticaCallBenchmarkResult<Model>): Record<string, string> {
  return Object.fromEntries([
    ["./README.md", writeIndex<Model>(result)],
    ...result.experiments
      .map<[string, string][]>(exp => [
        [`./${exp.scenario.name}/README.md`, writeExperimentIndex(exp)],
        ...exp.events.map<[string, string]>((event, i) => [
          `./${exp.scenario.name}/${i + 1}.${event.type}.md`,
          writeExperimentEvent(event, i),
        ]),
      ])
      .flat(),
  ]);
}

function writeIndex<Model extends ILlmSchema.Model>(result: IAgenticaCallBenchmarkResult<Model>): string {
  const events: IAgenticaCallBenchmarkEvent<Model>[] = result.experiments
    .map(r => r.events)
    .flat();
  const average: number
    = events
      .map(e => e.completed_at.getTime() - e.started_at.getTime())
      .reduce((a, b) => a + b, 0) / events.length;
  const aggregate: AgenticaTokenUsage.IComponent = result.usage.aggregate;
  return [
    "# LLM Function Call Benchmark",
    "## Summary",
    `  - Aggregation:`,
    `    - Scenarios: #${result.experiments.length.toLocaleString()}`,
    `    - Trial: ${events.length}`,
    `    - Success: ${events.filter(e => e.type === "success").length}`,
    `    - Failure: ${events.filter(e => e.type === "failure").length}`,
    `    - Average Time: ${MathUtil.round(average).toLocaleString()} ms`,
    `  - Token Usage`,
    `    - Total: ${aggregate.total.toLocaleString()}`,
    `    - Input`,
    `      - Total: ${aggregate.input.total.toLocaleString()}`,
    `      - Cached: ${aggregate.input.cached.toLocaleString()}`,
    `    - Output:`,
    `      - Total: ${aggregate.output.total.toLocaleString()}`,
    `      - Reasoning: ${aggregate.output.reasoning.toLocaleString()}`,
    `      - Accepted Prediction: ${aggregate.output.accepted_prediction.toLocaleString()}`,
    `      - Rejected Prediction: ${aggregate.output.rejected_prediction.toLocaleString()}`,
    "",
    "## Experiments",
    " Name | Select | Call | Time/Avg ",
    ":-----|:-------|:-----|----------:",
    ...result.experiments.map(exp =>
      [
        `[${exp.scenario.name}](./${exp.scenario.name}/README.md)`,
        drawStatus(
          exp.events,
          e => e.type !== "error" && e.select === true,
        ),
        drawStatus(exp.events, e => e.type !== "error" && e.call === true),
        `${MathUtil.round(
          exp.events
            .map(e => e.completed_at.getTime() - e.started_at.getTime())
            .reduce((a, b) => a + b, 0) / exp.events.length,
        ).toLocaleString()} ms`,
      ].join(" | "),
    ),
  ].join("\n");
}

function writeExperimentIndex<Model extends ILlmSchema.Model>(exp: IAgenticaCallBenchmarkResult.IExperiment<Model>): string {
  return [
    `# ${exp.scenario.name}`,
    "## Summary",
    `  - Scenarios: #${exp.events.length.toLocaleString()}`,
    `  - Success: ${exp.events.filter(e => e.type === "success").length}`,
    `  - Failure: ${exp.events.filter(e => e.type === "failure").length}`,
    `  - Average Time: ${MathUtil.round(
      exp.events
        .map(e => e.completed_at.getTime() - e.started_at.getTime())
        .reduce((a, b) => a + b, 0) / exp.events.length,
    ).toLocaleString()} ms`,
    "",
    "## Events",
    " Name | Type | Time",
    ":-----|:-----|----:",
    ...exp.events.map((e, i) =>
      [
        `[${i + 1}.](./${i + 1}.${e.type}.md)`,
        e.type,
        `${MathUtil.round(e.completed_at.getTime() - e.started_at.getTime())} ms`,
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
}

function writeExperimentEvent<Model extends ILlmSchema.Model>(event: IAgenticaCallBenchmarkEvent<Model>, index: number): string {
  return [
    `# ${index + 1}. ${event.type}`,
    "## Summary",
    `  - Name: ${event.scenario.name}`,
    `  - Type: ${event.type}`,
    `  - Time: ${MathUtil.round(
      event.completed_at.getTime() - event.started_at.getTime(),
    ).toLocaleString()} ms`,
    ...(event.type !== "error"
      ? [
          `  - Select: ${event.select ? "✅" : "❌"}`,
          `  - Call: ${event.call ? "✅" : "❌"}`,
        ]
      : []),
    `  - Token Usage:`,
    `    - Total: ${JSON.stringify(event.usage.aggregate.total)}`,
    `    - Input`,
    `      - Total: ${event.usage.aggregate.input.total}`,
    `      - Cached: ${event.usage.aggregate.input.cached}`,
    `    - Output:`,
    `      - Total: ${event.usage.aggregate.output.total}`,
    `      - Accepted Prediction: ${event.usage.aggregate.output.accepted_prediction}`,
    `      - Reasoning: ${event.usage.aggregate.output.reasoning}`,
    `      - Rejected Prediction: ${event.usage.aggregate.output.rejected_prediction}`,

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
    "## Prompt Histories",
    ...event.prompts.map(AgenticaPromptReporter.markdown),
    "",
    ...(event.type === "error"
      ? [
          "## Error",
          "```json",
          JSON.stringify(
            AgenticaBenchmarkUtil.errorToJson(event.error),
            null,
            2,
          ),
          "```",
        ]
      : []),
  ].join("\n");
}

function drawStatus<Model extends ILlmSchema.Model>(events: IAgenticaCallBenchmarkEvent<Model>[], success: (e: IAgenticaCallBenchmarkEvent<Model>) => boolean): string {
  const count: number = Math.floor(
    (events.filter(success).length / events.length) * 10,
  );
  // @TODO use String.prototype.padStart, padEnd or String.prototype.repeat
  return (
    Array.from({ length: count }).fill("■").join("")
    + Array.from({ length: 10 - count }).fill("□").join("")
  );
}
