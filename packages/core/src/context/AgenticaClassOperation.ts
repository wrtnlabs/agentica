import { ILlmApplication, ILlmFunction, ILlmSchema } from "@samchon/openapi";

import { AgenticaOperationBase } from "./AgenticaOperationBase";

export class AgenticaClassOperation<
  Model extends ILlmSchema.Model,
> extends AgenticaOperationBase<
  "class",
  ILlmApplication<Model>,
  ILlmFunction<Model>
> {
  public constructor(props: AgenticaClassOperation.IProps<Model>) {
    super(props);
  }
}
export namespace AgenticaClassOperation {
  export type IProps<Model extends ILlmSchema.Model> =
    AgenticaOperationBase.IProps<
      "class",
      ILlmApplication<Model>,
      ILlmFunction<Model>
    >;
}
