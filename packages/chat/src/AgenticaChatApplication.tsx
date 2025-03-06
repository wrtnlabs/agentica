import { Agentica } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatMovie } from "./movies/AgenticaChatMovie";

export const AgenticaChatApplication = <Model extends ILlmSchema.Model>(
  props: AgenticaChatApplication.IProps<Model>,
) => {
  return <AgenticaChatMovie {...props} />;
};
export namespace AgenticaChatApplication {
  export interface IProps<Model extends ILlmSchema.Model> {
    agent: Agentica<Model>;
    title?: string;
  }
}
