import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperation } from "../context/AgenticaOperation";
import { IAgenticaEventJson } from "../json/IAgenticaEventJson";
import { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaExecuteEvent<
  Model extends ILlmSchema.Model,
> extends AgenticaEventBase<"execute"> {
  public readonly id: string;
  public readonly operation: AgenticaOperation<Model>;
  public readonly arguments: Record<string, any>;
  public readonly value: any;

  public constructor(props: AgenticaExecuteEvent.IProps<Model>) {
    super("execute");
    this.id = props.id;
    this.operation = props.operation;
    this.arguments = props.arguments;
    this.value = props.value;
  }

  public toJSON(): IAgenticaEventJson.IExecute {
    return {
      type: "execute",
      id: this.id,
      operation: this.operation.toJSON(),
      arguments: this.arguments,
      value: this.value,
    };
  }

  public toPrompt(): AgenticaExecutePrompt<Model> {
    return new AgenticaExecutePrompt({
      id: this.id,
      operation: this.operation,
      arguments: this.arguments,
      value: this.value,
    });
  }
}
export namespace AgenticaExecuteEvent {
  export interface IProps<Model extends ILlmSchema.Model> {
    id: string;
    operation: AgenticaOperation<Model>;
    arguments: Record<string, any>;
    value: any;
  }
}
