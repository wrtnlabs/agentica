import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaTextEvent extends AgenticaEventBase<"text"> {
  public readonly role: "assistant" | "user";
  public readonly stream: ReadableStream<string>;
  public get text(): string {
    return this.get_();
  }

  /**
   * Check if the join method can return a response immediately.
   * Returns true if the response is ready to be returned by the join method.
   */
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

  public async join(): Promise<string> {
    return this.join_();
  }

  public toJSON(): IAgenticaEventJson.IText {
    return {
      type: "text",
      role: this.role,
      text: this.text,
      done: this.done,
    };
  }

  public toPrompt(): AgenticaTextPrompt {
    return new AgenticaTextPrompt({
      role: this.role,
      text: this.text,
    });
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
