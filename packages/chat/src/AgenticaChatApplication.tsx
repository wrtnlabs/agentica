import { Agentica } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatMovie } from "./movies/AgenticaChatMovie";

export const AgenticaChatApplication = <Model extends ILlmSchema.Model>({
  agent,
}: AgenticaChatApplication.IProps<Model>) => {
  return <AgenticaChatMovie agent={agent} />;
};
export namespace AgenticaChatApplication {
  export interface IProps<Model extends ILlmSchema.Model> {
    agent: Agentica<Model>;
  }
}
