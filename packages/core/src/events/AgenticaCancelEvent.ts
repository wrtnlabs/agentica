import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaCancelEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"cancel"> {
  public readonly selection: AgenticaOperationSelection<Model>;

  public constructor(props: AgenticaCancelEvent.IProps<Model>) {
    super("cancel");
    this.selection = props.selection;
  }

  public toJSON(): IAgenticaEventJson.ICancel {
    return {
      type: "cancel",
      selection: this.selection.toJSON(),
    };
  }
}
export namespace AgenticaCancelEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    selection: AgenticaOperationSelection<Model>;
  }
}
