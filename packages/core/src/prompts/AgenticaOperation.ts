import { ILlmSchema } from "@samchon/openapi";

import { AgenticaClassOperation } from "./AgenticaClassOperation";
import { AgenticaHttpOperation } from "./AgenticaHttpOperation";

export type AgenticaOperation<Model extends ILlmSchema.Model> =
  | AgenticaClassOperation<Model>
  | AgenticaHttpOperation<Model>;
export namespace AgenticaOperation {
  export type Class<Model extends ILlmSchema.Model> =
    AgenticaClassOperation<Model>;
  export type Http<Model extends ILlmSchema.Model> =
    AgenticaHttpOperation<Model>;
}
