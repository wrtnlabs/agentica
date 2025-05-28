import type {
  Agentica,
  AgenticaContext,
  AgenticaEvent,
  AgenticaHistory,
  AgenticaOperationSelection,
} from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";
import type { tags } from "typia";

/**
 * @module
 * This file contains the implementation of the AgenticaSelectBenchmark class.
 *
 * @author Wrtn Technologies
 */
import { AgenticaTokenUsage, factory, orchestrate } from "@agentica/core";
import { Semaphore } from "tstl";
import { v4 } from "uuid";

import type { IAgenticaSelectBenchmarkEvent } from "./structures/IAgenticaSelectBenchmarkEvent";
import type { IAgenticaSelectBenchmarkResult } from "./structures/IAgenticaSelectBenchmarkResult";
import type { IAgenticaSelectBenchmarkScenario } from "./structures/IAgenticaSelectBenchmarkScenario";

import { AgenticaBenchmarkPredicator } from "./internal/AgenticaBenchmarkPredicator";
import { AgenticaSelectBenchmarkReporter } from "./internal/AgenticaSelectBenchmarkReporter";

/**
 * LLM function calling selection benchmark.
 *
 * `AgenticaSelectBenchmark` is a class for the benchmark of the
 * LLM (Large Model Language) function calling's selection part.
 * It utilizes the `selector` agent and tests whether the expected
 * {@link IAgenticaOperation operations} are properly selected from
 * the given {@link IAgenticaSelectBenchmarkScenario scenarios}.
 *
 * Note that, this `AgenticaSelectBenchmark` class measures only the
 * selection benchmark, testing whether the `selector` agent can select
 * candidate functions to call as expected. Therefore, it does not test
 * about the actual function calling which is done by the `executor` agent.
 * If you want that feature, use {@link AgenticaCallBenchmark} class instead.
 *
 * @author Samchon
 */
export class AgenticaSelectBenchmark<Model extends ILlmSchema.Model> {
  private agent_: Agentica<Model>;
  private scenarios_: IAgenticaSelectBenchmarkScenario<Model>[];
  private config_: AgenticaSelectBenchmark.IConfig;
  private histories_: AgenticaHistory<Model>[];
  private result_: IAgenticaSelectBenchmarkResult<Model> | null;

  /**
   * Initializer Constructor.
   *
   * @param props Properties of the selection benchmark
   */
  public constructor(props: AgenticaSelectBenchmark.IProps<Model>) {
    this.agent_ = props.agent;
    this.scenarios_ = props.scenarios.slice();
    this.config_ = {
      repeat: props.config?.repeat ?? 10,
      simultaneous: props.config?.simultaneous ?? 10,
    };
    this.histories_ = props.agent.getHistories().slice();
    this.result_ = null;
  }

  /**
   * Execute the benchmark.
   *
   * Execute the benchmark of the LLM function selection, and returns
   * the result of the benchmark.
   *
   * If you wanna see progress of the benchmark, you can pass a callback
   * function as the argument of the `listener`. The callback function
   * would be called whenever a benchmark event is occurred.
   *
   * Also, you can publish a markdown format report by calling
   * the {@link report} function after the benchmark execution.
   *
   * @param listener Callback function listening the benchmark events
   * @returns Results of the function selection benchmark
   */
  public async execute(
    listener?: (event: IAgenticaSelectBenchmarkEvent<Model>) => void,
  ): Promise<IAgenticaSelectBenchmarkResult<Model>> {
    const started_at: Date = new Date();
    const semaphore: Semaphore = new Semaphore(this.config_.simultaneous);
    const experiments: IAgenticaSelectBenchmarkResult.IExperiment<Model>[]
      = await Promise.all(
        this.scenarios_.map(async (scenario) => {
          const events: IAgenticaSelectBenchmarkEvent<Model>[]
            = await Promise.all(
              Array.from({ length: this.config_.repeat }).map(async () => {
                await semaphore.acquire();
                const e: IAgenticaSelectBenchmarkEvent<Model>
                  = await this.step(scenario);
                await semaphore.release();
                if (listener !== undefined) {
                  listener(e);
                }
                return e;
              }),
            );
          return {
            scenario,
            events,
            usage: events
              .filter(e => e.type !== "error")
              .map(e => e.usage)
              .reduce((acc, cur) => AgenticaTokenUsage.plus(acc, cur), AgenticaTokenUsage.zero()),
          };
        }),
      );
    return (this.result_ = {
      experiments,
      started_at,
      completed_at: new Date(),
      usage: experiments
        .map(p => p.usage)
        .reduce((acc, cur) => AgenticaTokenUsage.plus(acc, cur), AgenticaTokenUsage.zero()),
    });
  }

  /**
   * Report the benchmark result as markdown files.
   *
   * Report the benchmark result {@link execute}d by
   * `AgenticaSelectBenchmark` as markdown files, and returns a
   * dictionary object of the markdown reporting files. The key of
   * the dictionary would be file name, and the value would be the
   * markdown content.
   *
   * For reference, the markdown files are composed like below:
   *
   * - `./README.md`
   * - `./scenario-1/README.md`
   * - `./scenario-1/1.success.md`
   * - `./scenario-1/2.failure.md`
   * - `./scenario-1/3.error.md`
   *
   * @returns Dictionary of markdown files.
   */
  public report(): Record<string, string> {
    if (this.result_ === null) {
      throw new Error("Benchmark is not executed yet.");
    }
    return AgenticaSelectBenchmarkReporter.markdown(this.result_);
  }

  private async step(
    scenario: IAgenticaSelectBenchmarkScenario<Model>,
  ): Promise<IAgenticaSelectBenchmarkEvent<Model>> {
    const started_at: Date = new Date();
    try {
      const usage: AgenticaTokenUsage = AgenticaTokenUsage.zero();
      const historyGetters: Array<() => Promise<AgenticaHistory<Model>>> = [];
      const dispatch = (event: AgenticaEvent<Model>): void => {
        if ("toHistory" in event) {
          if ("join" in event) {
            historyGetters.push(async () => {
              await event.join();
              return event.toHistory();
            });
          }
          else {
            historyGetters.push(async () => event.toHistory());
          }
        }
      };
      const context: AgenticaContext<Model> = this.agent_.getContext({
        prompt: factory.createUserMessageHistory({
          id: v4(),
          created_at: started_at.toISOString(),
          contents: [{
            type: "text",
            text: scenario.text,
          }],
        }),
        usage,
        dispatch,
      });
      if (typeof context.config?.executor === "function") {
        throw new TypeError("select function is not found");
      }

      await (context.config?.executor?.select ?? orchestrate.select)({
        ...context,
        histories: this.histories_.slice(),
        stack: [],
        ready: () => true,
      });
      const histories: AgenticaHistory<Model>[]
        = await Promise.all(
          historyGetters.map(async g => g()),
        );
      const selected: AgenticaOperationSelection<Model>[] = histories
        .filter(p => p.type === "select")
        .map(p => p.selection);
      return {
        type: AgenticaBenchmarkPredicator.success({
          expected: scenario.expected,
          operations: selected.map(s => s.operation),
        })
          ? "success"
          : "failure",
        scenario,
        selected,
        usage,
        assistantPrompts: histories
          // Only the assistant is allowed to emit text events.
          .filter(p => p.type === "assistantMessage"),
        started_at,
        completed_at: new Date(),
      } satisfies
      | IAgenticaSelectBenchmarkEvent.ISuccess<Model>
      | IAgenticaSelectBenchmarkEvent.IFailure<Model>;
    }
    catch (error) {
      return {
        type: "error",
        scenario,
        error,
        started_at,
        completed_at: new Date(),
      } satisfies IAgenticaSelectBenchmarkEvent.IError<Model>;
    }
  }
}
export namespace AgenticaSelectBenchmark {
  /**
   * Properties of the {@link AgenticaSelectBenchmark} constructor.
   */
  export interface IProps<Model extends ILlmSchema.Model> {
    /**
     * AI agent instance.
     */
    agent: Agentica<Model>;

    /**
     * List of scenarios what you expect.
     */
    scenarios: IAgenticaSelectBenchmarkScenario<Model>[];

    /**
     * Configuration for the benchmark.
     */
    config?: Partial<IConfig>;
  }

  /**
   * Configuration for the benchmark.
   *
   * `AgenticaSelectBenchmark.IConfig` is a data structure which
   * represents a configuration for the benchmark, especially the
   * capacity information of the benchmark execution.
   */
  export interface IConfig {
    /**
     * Repeat count.
     *
     * The number of repeating count for the benchmark execution
     * for each scenario.
     *
     * @default 10
     */
    repeat: number & tags.Type<"uint32"> & tags.Minimum<1>;

    /**
     * Simultaneous count.
     *
     * The number of simultaneous count for the parallel benchmark
     * execution.
     *
     * If you configure this property greater than `1`, the benchmark
     * for each scenario would be executed in parallel in the given
     * count.
     *
     * @default 10
     */
    simultaneous: number & tags.Type<"uint32"> & tags.Minimum<1>;
  }
}
