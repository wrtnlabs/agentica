import type { Agentica, MicroAgentica } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatMovie } from "./movies/AgenticaChatMovie";

export function AgenticaChatApplication<Model extends ILlmSchema.Model>(props: AgenticaChatApplication.IProps<Model>) {
  return <AgenticaChatMovie {...props} />;
}
export namespace AgenticaChatApplication {
  export interface IProps<Model extends ILlmSchema.Model> {
    agent: Agentica<Model> | MicroAgentica<Model>;
    title?: string;
  }
}
