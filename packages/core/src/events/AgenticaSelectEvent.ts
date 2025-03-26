import type { ILlmSchema } from "@samchon/openapi";
import type { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";

import type { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import { v4 } from "uuid";
import { AgenticaSelectPrompt } from "../prompts/AgenticaSelectPrompt";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaSelectEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"select"> {
  public readonly selection: AgenticaOperationSelection<Model>;

  public constructor(props: AgenticaSelectEvent.IProps<Model>) {
    super("select");
    this.selection = props.selection;
  }

  public toJSON(): IAgenticaEventJson.ISelect {
    return {
      type: "select",
      selection: this.selection.toJSON(),
    };
  }

  public toPrompt(): AgenticaSelectPrompt<Model> {
    return new AgenticaSelectPrompt({
      id: v4(),
      selections: [this.selection],
    });
  }
}
export namespace AgenticaSelectEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    selection: AgenticaOperationSelection<Model>;
  }
}
