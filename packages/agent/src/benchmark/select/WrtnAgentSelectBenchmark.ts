import { Semaphore } from "tstl";
import { tags } from "typia";

import { WrtnAgent } from "../../WrtnAgent";
import { ChatGptSelectFunctionAgent } from "../../chatgpt/ChatGptSelectFunctionAgent";
import { TokenUsageComputer } from "../../internal/TokenUsageComputer";
import { IWrtnAgentContext } from "../../structures/IWrtnAgentContext";
import { IWrtnAgentOperation } from "../../structures/IWrtnAgentOperation";
import { IWrtnAgentOperationSelection } from "../../structures/IWrtnAgentOperationSelection";
import { IWrtnAgentPrompt } from "../../structures/IWrtnAgentPrompt";
import { IWrtnAgentTokenUsage } from "../../structures/IWrtnAgentTokenUsage";
import { IWrtnAgentSelectBenchmarkEvent } from "./IWrtnAgentSelectBenchmarkEvent";
import { IWrtnAgentSelectBenchmarkResult } from "./IWrtnAgentSelectBenchmarkResult";
import { IWrtnAgentSelectBenchmarkScenario } from "./IWrtnAgentSelectBenchmarkScenario";
import { WrtnAgentSelectBenchmarkReporter } from "./internal/WrtnAgentSelectBenchmarkReporter";

/**
 * LLM function calling selection benchmark.
 *
 * `WrtnAgentSelectBenchmark` is a class for the benchmark of the
 * LLM (Large Model Language) function calling's selection part.
 * It utilizes the `selector` agent and tests whether the expected
 * {@link IWrtnAgentOperation operations} are properly selected from
 * the given {@link IWrtnAgentSelectBenchmarkScenario scenarios}.
 *
 * Note that, this `WrtnAgentSelectBenchmark` class measures only the
 * selection benchmark, testing whether the `selector` agent can select
 * candidate functions to call as expected. Therefore, it does not test
 * about the actual function calling which is done by the `executor` agent.
 * If you want that feature, use {@link WrtnAgentCallBenchmark} class instead.
 *
 * @author Samchon
 */
export class WrtnAgentSelectBenchmark {
  private agent_: WrtnAgent;
  private scenarios_: IWrtnAgentSelectBenchmarkScenario[];
  private config_: WrtnAgentSelectBenchmark.IConfig;
  private histories_: IWrtnAgentPrompt[];

  private result_: IWrtnAgentSelectBenchmarkResult | null;

  /**
   * Initializer Constructor.
   *
   * @param props Properties of the selection benchmark
   */
  public constructor(props: WrtnAgentSelectBenchmark.IProps) {
    this.agent_ = props.agent;
    this.scenarios_ = props.scenarios.slice();
    this.config_ = {
      repeat: props.config?.repeat ?? 10,
      simultaneous: props.config?.simultaneous ?? 10,
    };
    this.histories_ = props.agent.getPromptHistories().slice();
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
   * @returns Results of the selection benchmark
   */
  public async execute(
    listener?: (event: IWrtnAgentSelectBenchmarkEvent) => void,
  ): Promise<IWrtnAgentSelectBenchmarkResult> {
    const started_at: Date = new Date();
    const semaphore: Semaphore = new Semaphore(this.config_.simultaneous);
    const processes: IWrtnAgentSelectBenchmarkResult.IExperiment[] =
      await Promise.all(
        this.scenarios_.map(async (scenario) => {
          const events: IWrtnAgentSelectBenchmarkEvent[] = await Promise.all(
            new Array(this.config_.repeat).fill(0).map(async () => {
              await semaphore.acquire();
              const e: IWrtnAgentSelectBenchmarkEvent =
                await this.step(scenario);
              await semaphore.release();
              if (listener !== undefined) listener(e);
              return e;
            }),
          );
          return {
            scenario,
            events,
            usage: events
              .filter((e) => e.type !== "error")
              .map((e) => e.usage)
              .reduce(TokenUsageComputer.plus, TokenUsageComputer.zero()),
          };
        }),
      );
    return (this.result_ = {
      experiments: processes,
      started_at,
      completed_at: new Date(),
      usage: processes
        .map((p) => p.usage)
        .reduce(TokenUsageComputer.plus, TokenUsageComputer.zero()),
    });
  }

  /**
   * Report the benchmark result as markdown files.
   *
   * Report the benchmark result {@link execute}d by
   * `WrtnAgentSelectBenchmark` as markdown files, and returns a dictionary
   * object of the markdown reporting files. The key of the dictionary would
   * be file name, and the value would be the markdown content.
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
    if (this.result_ === null)
      throw new Error("Benchmark is not executed yet.");
    return WrtnAgentSelectBenchmarkReporter.markdown(this.result_);
  }

  /**
   * @hidden
   */
  private async step(
    scenario: IWrtnAgentSelectBenchmarkScenario,
  ): Promise<IWrtnAgentSelectBenchmarkEvent> {
    const started_at: Date = new Date();
    try {
      const usage: IWrtnAgentTokenUsage = {
        total: 0,
        prompt: {
          total: 0,
          audio: 0,
          cached: 0,
        },
        completion: {
          total: 0,
          accepted_prediction: 0,
          audio: 0,
          reasoning: 0,
          rejected_prediction: 0,
        },
      };
      const prompts: IWrtnAgentPrompt[] =
        await ChatGptSelectFunctionAgent.execute({
          ...this.agent_.getContext({
            prompt: {
              type: "text",
              role: "user",
              text: scenario.text,
            },
            usage,
          }),
          histories: this.histories_.slice(),
          stack: [],
          ready: () => true,
          dispatch: async () => {},
        } satisfies IWrtnAgentContext);
      const selected: IWrtnAgentOperationSelection[] = prompts
        .filter((p) => p.type === "select")
        .map((p) => p.operations)
        .flat();
      return {
        type: scenario.operations.every((op) =>
          selected.some((s) => s.name === op.name),
        )
          ? "success"
          : "failure",
        scenario,
        selected,
        usage,
        assistantPrompts: prompts
          .filter((p) => p.type === "text")
          .filter(
            (p): p is IWrtnAgentPrompt.IText<"assistant"> =>
              p.role === "assistant",
          ),
        started_at,
        completed_at: new Date(),
      } satisfies
        | IWrtnAgentSelectBenchmarkEvent.ISuccess
        | IWrtnAgentSelectBenchmarkEvent.IFailure;
    } catch (error) {
      return {
        type: "error",
        scenario,
        error,
        started_at,
        completed_at: new Date(),
      } satisfies IWrtnAgentSelectBenchmarkEvent.IError;
    }
  }
}
export namespace WrtnAgentSelectBenchmark {
  /**
   * Properties of the {@link WrtnAgentSelectBenchmark} constructor.
   */
  export interface IProps {
    /**
     * AI agent instance.
     */
    agent: WrtnAgent;

    /**
     * List of scenarios what you expect.
     */
    scenarios: IWrtnAgentSelectBenchmarkScenario[];

    /**
     * Configuration for the benchmark.
     */
    config?: Partial<IConfig>;
  }

  /**
   * Configuration for the benchmark.
   *
   * `WrtnAgentSelectBenchmark.IConfig` is a data structure which
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
