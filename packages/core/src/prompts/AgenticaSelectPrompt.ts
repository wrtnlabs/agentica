import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { AgenticaOperationSelection } from "./AgenticaOperationSelection";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaSelectPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"select", IAgenticaPrompt.ISelect> {
  public readonly id: string;
  public readonly selections: AgenticaOperationSelection<Model>[];

  public constructor(props: AgenticaSelectPrompt.IProps<Model>) {
    super("select");
    this.id = props.id;
    this.selections = props.selections;
  }

  public toJSON(): IAgenticaPrompt.ISelect {
    return {
      type: this.type,
      id: this.id,
      selections: this.selections.map((s) => s.toJSON()),
    };
  }
}
export namespace AgenticaSelectPrompt {
  export interface IProps<Model extends ILlmSchema.Model> {
    id: string;
    selections: AgenticaOperationSelection<Model>[];
  }
}
