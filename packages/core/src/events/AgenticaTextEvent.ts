import { IAgenticaEvent } from "../structures/IAgenticaEvent";

export class AgenticaTextEvent extends AgenticaEventBase<"text"> {
  public readonly role: "assistant" | "user";
  public readonly stream: ReadableStream<string>;
  private text_: string | null;

  public constructor() {
    super("text");
    this.text_ = null;
  }

  public async join(): Promise<string> {}

  public toJSON(): IAgenticaEvent.IText {
    if (this.text_ === null) throw new Error("Stream is not completed yet.");
    return {
      type: "text",
      role: this.role,
      text: this.text_,
    };
  }

  public async toAsyncJson(): Promise<IAgenticaEvent.IText> {
    return {
      type: "text",
      role: this.role,
      text: await this.join(),
    };
  }
}
