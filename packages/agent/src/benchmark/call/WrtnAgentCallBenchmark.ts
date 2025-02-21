import { Semaphore } from "tstl";
import { tags } from "typia";

import { WrtnAgent } from "../../WrtnAgent";
import { TokenUsageComputer } from "../../internal/TokenUsageComputer";
import { WrtnAgentBenchmarkPredicator } from "../common/WrtnAgentBenchmarkPredicator";
import { IWrtnAgentCallBenchmarkEvent } from "./IWrtnAgentCallBenchmarkEvent";
import { IWrtnAgentCallBenchmarkResult } from "./IWrtnAgentCallBenchmarkResult";
import { IWrtnAgentCallBenchmarkScenario } from "./IWrtnAgentCallBenchmarkScenario";
import { WrtnAgentCallBenchmarkReporter } from "./internal/WrtnAgentCallBenchmarkReporter";

export class WrtnAgentCallBenchmark {
  private agent_: WrtnAgent;
  private scenarios_: IWrtnAgentCallBenchmarkScenario[];
  private config_: WrtnAgentCallBenchmark.IConfig;
  private result_: IWrtnAgentCallBenchmarkResult | null;

  /**
   * Initializer Constructor.
   *
   * @param props Properties of the selection benchmark
   */
  public constructor(props: WrtnAgentCallBenchmark.IProps) {
    this.agent_ = props.agent;
    this.scenarios_ = props.scenarios.slice();
    this.config_ = {
      repeat: props.config?.repeat ?? 10,
      simultaneous: props.config?.simultaneous ?? 10,
      consent: props.config?.consent ?? 3,
    };
    this.result_ = null;
  }

  public async execute(
    listener?: (event: IWrtnAgentCallBenchmarkEvent) => void,
  ): Promise<IWrtnAgentCallBenchmarkResult> {
    const started_at: Date = new Date();
    const semaphore: Semaphore = new Semaphore(this.config_.simultaneous);
    const experiments: IWrtnAgentCallBenchmarkResult.IExperiment[] =
      await Promise.all(
        this.scenarios_.map(async (scenario) => {
          const events: IWrtnAgentCallBenchmarkEvent[] = await Promise.all(
            new Array(this.config_.repeat).fill(0).map(async () => {
              await semaphore.acquire();
              const e: IWrtnAgentCallBenchmarkEvent = await this.step(scenario);
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
      experiments,
      started_at,
      completed_at: new Date(),
      usage: experiments
        .map((p) => p.usage)
        .reduce(TokenUsageComputer.plus, TokenUsageComputer.zero()),
    });
  }

  /**
   * Report the benchmark result as markdown files.
   *
   * Report the benchmark result {@link execute}d by
   * `WrtnAgentCallBenchmark` as markdown files, and returns a dictionary
   * object of the markdown reporting files. The key of the dictionary
   * would be file name, and the value would be the markdown content.
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
    return WrtnAgentCallBenchmarkReporter.markdown(this.result_);
  }

  private async step(
    scenario: IWrtnAgentCallBenchmarkScenario,
  ): Promise<IWrtnAgentCallBenchmarkEvent> {
    const agent: WrtnAgent = this.agent_.clone();
    const started_at: Date = new Date();
    const success = () =>
      WrtnAgentBenchmarkPredicator.success({
        agent,
        expected: scenario.expected,
        operations: agent
          .getPromptHistories()
          .filter((p) => p.type === "execute"),
        strict: false,
      });
    const out = (): IWrtnAgentCallBenchmarkEvent => {
      const select = WrtnAgentBenchmarkPredicator.success({
        agent,
        expected: scenario.expected,
        operations: agent
          .getPromptHistories()
          .filter((p) => p.type === "select")
          .map((p) => p.operations)
          .flat(),
        strict: false,
      });
      const call = success();
      return {
        type: (call ? "success" : "failure") as "failure",
        scenario,
        select,
        call,
        prompts: agent.getPromptHistories(),
        usage: agent.getTokenUsage(),
        started_at,
        completed_at: new Date(),
      } satisfies IWrtnAgentCallBenchmarkEvent.IFailure;
    };

    try {
      await agent.conversate(scenario.text);
      if (success()) return out();
      for (let i: number = 0; i < this.config_.consent; ++i) {
        const next: string | null =
          await WrtnAgentBenchmarkPredicator.isNext(agent);
        if (next === null) break;

        await agent.conversate(next);
        if (success()) return out();
      }
      return out();
    } catch (error) {
      return {
        type: "error",
        scenario,
        prompts: agent.getPromptHistories(),
        usage: agent.getTokenUsage(),
        error,
        started_at,
        completed_at: new Date(),
      };
    }
  }
}
export namespace WrtnAgentCallBenchmark {
  /**
   * Properties of the {@link WrtnAgentCallBenchmark} constructor.
   */
  export interface IProps {
    /**
     * AI agent instance.
     */
    agent: WrtnAgent;

    /**
     * List of scenarios what you expect.
     */
    scenarios: IWrtnAgentCallBenchmarkScenario[];

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

    /**
     * Number of consents.
     *
     * AI agent sometimes asks user to consent to the function
     * calling, and perform it at the next step.
     *
     * This property represents the number of consents to allow.
     * If the number of consents from the AI agent exceeds the
     * configured value, the benchmark will be failed.
     *
     * @default 3
     */
    consent: number;
  }
}
