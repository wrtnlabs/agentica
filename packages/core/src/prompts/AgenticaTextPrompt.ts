import type { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaTextPrompt<
  Role extends "assistant" | "user" = "assistant" | "user",
> extends AgenticaPromptBase<"text", IAgenticaPromptJson.IText> {
  public readonly role: Role;
  public readonly text: string;

  public constructor(props: AgenticaTextPrompt.IProps<Role>) {
    super("text");
    this.role = props.role;
    this.text = props.text;
  }

  public toJSON(): IAgenticaPromptJson.IText<Role> {
    return {
      type: this.type,
      role: this.role,
      text: this.text,
    };
  }
}
export namespace AgenticaTextPrompt {
  export interface IProps<
    Role extends "assistant" | "user" = "assistant" | "user",
  > {
    role: Role;
    text: string;
  }
}
