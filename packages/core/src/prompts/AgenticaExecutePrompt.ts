import { IHttpResponse, ILlmSchema } from "@samchon/openapi";

import { AgenticaOperation } from "../context/AgenticaOperation";
import { IAgenticaPrompt } from "../json/IAgenticaPrompt";
import { AgenticaPromptBase } from "./AgenticaPromptBase";

export class AgenticaExecutePrompt<
  Model extends ILlmSchema.Model,
  Protocol extends "http" | "class" = any,
> extends AgenticaPromptBase<"execute", IAgenticaPrompt.IExecute> {
  public readonly id: string;
  public readonly operation: Protocol extends "http"
    ? AgenticaOperation.Http<Model>
    : Protocol extends "class"
      ? AgenticaOperation.Class<Model>
      : AgenticaOperation<Model>;
  public readonly arguments: Record<string, any>;
  public readonly value: Protocol extends "http" ? IHttpResponse : any;

  public constructor(props: AgenticaExecutePrompt.IProps<Model, Protocol>) {
    super("execute");
    this.id = props.id;
    this.operation = props.operation;
    this.arguments = props.arguments;
    this.value = props.value;
  }

  public toJSON(): IAgenticaPrompt.IExecute {
    return {
      type: this.type,
      id: this.id,
      operation: this.operation.toJSON(),
      arguments: this.arguments,
      value: this.value,
    };
  }
}
export namespace AgenticaExecutePrompt {
  export interface IProps<
    Model extends ILlmSchema.Model,
    Protocol extends "http" | "class" = any,
  > {
    id: string;
    operation: Protocol extends "http"
      ? AgenticaOperation.Http<Model>
      : Protocol extends "class"
        ? AgenticaOperation.Class<Model>
        : AgenticaOperation<Model>;
    arguments: Record<string, any>;
    value: Protocol extends "http" ? IHttpResponse : any;
  }
}
