import { IAgenticaEvent } from "../json/IAgenticaEvent";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaTextEvent extends AgenticaEventBase<"text"> {
  public readonly role: "assistant" | "user";
  public readonly stream: ReadableStream<string>;
  public get text(): string {
    return this.get_();
  }
  public get done(): boolean {
    return this.done_();
  }

  public constructor(props: AgenticaTextEvent.IProps) {
    super("text");
    this.role = props.role;
    this.stream = props.stream;

    this.done_ = props.done;
    this.get_ = props.get;
    this.join_ = props.join;
  }

  public join(): Promise<string> {
    return this.join_();
  }

  public toJSON(): IAgenticaEvent.IText {
    return {
      type: "text",
      role: this.role,
      text: this.text,
      done: this.done,
    };
  }

  private readonly done_: () => boolean;
  private readonly get_: () => string;
  private readonly join_: () => Promise<string>;
}
export namespace AgenticaTextEvent {
  export interface IProps {
    role: "assistant" | "user";
    stream: ReadableStream<string>;
    done: () => boolean;
    get: () => string;
    join: () => Promise<string>;
  }
}
