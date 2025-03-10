import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaEvent } from "../json/IAgenticaEvent";
import { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaDescribeEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"describe"> {
  public readonly executes: AgenticaExecutePrompt<Model>[];
  public readonly stream: ReadableStream<string>;
  public get text(): string {
    return this.get_();
  }
  public get done(): boolean {
    return this.done_();
  }

  public constructor(props: AgenticaDescribeEvent.IProps<Model>) {
    super("describe");
    this.stream = props.stream;
    this.executes = props.executes;
    this.done_ = props.done;
    this.get_ = props.get;
    this.join_ = props.join;
  }

  public join(): Promise<string> {
    return this.join_();
  }

  public toJSON(): IAgenticaEvent.IDescribe {
    return {
      type: "describe",
      executions: this.executes.map((e) => e.toJSON()),
      text: this.text,
      done: this.done,
    };
  }

  private readonly done_: () => boolean;
  private readonly get_: () => string;
  private readonly join_: () => Promise<string>;
}
export namespace AgenticaDescribeEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    executes: AgenticaExecutePrompt<Model>[];
    stream: ReadableStream<string>;
    done: () => boolean;
    get: () => string;
    join: () => Promise<string>;
  }
}
