import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { AgenticaExecutePrompt } from "./AgenticaExecutePrompt";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaDescribePrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"describe", IAgenticaPrompt.IDescribe> {
  /**
   * Executions of the LLM function calling.
   *
   * This prompt describes the return value of them.
   */
  public readonly executions: AgenticaExecutePrompt<Model>[];

  /**
   * Description text.
   */
  public readonly text: string;

  public constructor(props: AgenticaDescribePrompt.IProps<Model>) {
    super("describe");
    this.executions = props.executions;
    this.text = props.text;
  }

  public toJSON(): IAgenticaPrompt.IDescribe {
    return {
      type: this.type,
      executions: this.executions.map((e) => e.toJSON()),
      text: this.text,
    };
  }
}
export namespace AgenticaDescribePrompt {
  export interface IProps<Model extends ILlmSchema.Model> {
    executions: AgenticaExecutePrompt<Model>[];
    text: string;
  }
}
