import {
  IHttpLlmApplication,
  IHttpLlmFunction,
  ILlmSchema,
} from "@samchon/openapi";

import { AgenticaOperationBase } from "./AgenticaOperationBase";

export class AgenticaHttpOperation<
  Model extends ILlmSchema.Model,
> extends AgenticaOperationBase<
  "http",
  IHttpLlmApplication<Model>,
  IHttpLlmFunction<Model>
> {
  public constructor(props: AgenticaHttpOperation.IProps<Model>) {
    super(props);
  }
}
export namespace AgenticaHttpOperation {
  export type IProps<Model extends ILlmSchema.Model> =
    AgenticaOperationBase.IProps<
      "http",
      IHttpLlmApplication<Model>,
      IHttpLlmFunction<Model>
    >;
}
