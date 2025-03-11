import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { IAgenticaPromptJson } from "../json/IAgenticaPromptJson";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaSelectPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"select", IAgenticaPromptJson.ISelect> {
  public readonly id: string;
  public readonly selections: AgenticaOperationSelection<Model>[];

  public constructor(props: AgenticaSelectPrompt.IProps<Model>) {
    super("select");
    this.id = props.id;
    this.selections = props.selections;
  }

  public toJSON(): IAgenticaPromptJson.ISelect {
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
