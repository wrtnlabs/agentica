import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperationSelection } from "../context/AgenticaOperationSelection";
import { IAgenticaEvent } from "../json/IAgenticaEvent";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaCancelEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"cancel"> {
  public readonly selection: AgenticaOperationSelection<Model>;

  public constructor(props: AgenticaCancelEvent.IProps<Model>) {
    super("cancel");
    this.selection = props.selection;
  }

  public toJSON(): IAgenticaEvent.ICancel {
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
