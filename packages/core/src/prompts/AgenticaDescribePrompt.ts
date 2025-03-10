import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaDescribePrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"describe", IAgenticaPromptJson.IDescribe> {
  /**
   * Executions of the LLM function calling.
   *
   * This prompt describes the return value of them.
   */
  public readonly executes: AgenticaExecutePrompt<Model>[];

  /**
   * Description text.
   */
  public readonly text: string;

  public constructor(props: AgenticaDescribePrompt.IProps<Model>) {
    super("describe");
    this.executes = props.executes;
    this.text = props.text;
  }

  public toJSON(): IAgenticaPromptJson.IDescribe {
    return {
      type: this.type,
      executions: this.executes.map((e) => e.toJSON()),
      text: this.text,
    };
  }
}
export namespace AgenticaDescribePrompt {
  export interface IProps<Model extends ILlmSchema.Model> {
    executes: AgenticaExecutePrompt<Model>[];
    text: string;
  }
}
