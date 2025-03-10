import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { IAgenticaEventJson } from "../json/IAgenticaEventJson";
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
}
export namespace AgenticaSelectEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    selection: AgenticaOperationSelection<Model>;
  }
}
