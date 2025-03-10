import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaEvent } from "../structures/IAgenticaEvent";
import { AgenticaOperation } from "./AgenticaOperation";

export class AgenticaSelectEvent<Model extends ILlmSchema.Model> {
  public readonly operation: AgenticaOperation<Model>;
  public readonly reason: string;

  public constructor(props: AgenticaSelectEvent.IProps<Model>) {
    this.operation = props.operation;
    this.reason = props.reason;
  }

  public toJSON(): IAgenticaEvent.ISelect {
    return {
      type: "select",
      operation: this.operation.toJSON(),
      reason: this.reason,
    };
  }
}
export namespace AgenticaSelectEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    operation: AgenticaOperation<Model>;
    reason: string;
  }
}
