import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaPrompt } from "../structures/IAgenticaPrompt";
import { AgenticaOperationSelection } from "./AgenticaOperationSelection";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaCancelPrompt<
  Model extends ILlmSchema.Model,
> extends AgenticaPromptBase<"cancel", IAgenticaPrompt.ICancel> {
  public readonly id: string;
  public readonly selections: AgenticaOperationSelection<Model>[];

  public constructor(props: AgenticaCancelPrompt.IProps<Model>) {
    super("cancel");
    this.id = props.id;
    this.selections = props.selections;
  }

  public toJSON(): IAgenticaPrompt.ICancel {
    return {
      type: this.type,
      id: this.id,
      selections: this.selections.map((s) => s.toJSON()),
    };
  }
}
export namespace AgenticaCancelPrompt {
  export interface IProps<Model extends ILlmSchema.Model> {
    id: string;
    selections: AgenticaOperationSelection<Model>[];
  }
}
