import { ILlmSchema } from "@samchon/openapi";

import { IAgenticaOperationSelection } from "../structures/IAgenticaOperationSelection";
import { AgenticaOperation } from "./AgenticaOperation";

export class AgenticaOperationSelection<Model extends ILlmSchema.Model> {
  public readonly operation: AgenticaOperation<Model>;
  public readonly reason: string;

  public constructor(props: AgenticaOperationSelection.IProps<Model>) {
    this.operation = props.operation;
    this.reason = props.reason;
  }

  public toJSON(): IAgenticaOperationSelection {
    return {
      operation: this.operation.toJSON(),
      reason: this.reason,
    };
  }
}
export namespace AgenticaOperationSelection {
  export interface IProps<Model extends ILlmSchema.Model> {
    operation: AgenticaOperation<Model>;
    reason: string;
  }
}
