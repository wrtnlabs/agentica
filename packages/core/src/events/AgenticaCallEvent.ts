import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperation } from "../context/AgenticaOperation";
import { IAgenticaEvent } from "../json/IAgenticaEvent";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaCallEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"call"> {
  public readonly id: string;
  public readonly operation: AgenticaOperation<Model>;
  public readonly arguments: Record<string, any>;

  public constructor(props: AgenticaCallEvent.IProps<Model>) {
    super("call");
    this.id = props.id;
    this.operation = props.operation;
    this.arguments = props.arguments;
  }

  public toJSON(): IAgenticaEvent.ICall {
    return {
      type: "call",
      id: this.id,
      operation: this.operation.toJSON(),
      arguments: this.arguments,
    };
  }
}
export namespace AgenticaCallEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    id: string;
    operation: AgenticaOperation<Model>;
    arguments: Record<string, any>;
  }
}
