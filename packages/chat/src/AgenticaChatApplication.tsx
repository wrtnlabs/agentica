import type { Agentica, MicroAgentica } from "@agentica/core";

import { AgenticaChatMovie } from "./movies/AgenticaChatMovie";

export function AgenticaChatApplication(props: AgenticaChatApplication.IProps) {
  return <AgenticaChatMovie {...props} />;
}
export namespace AgenticaChatApplication {
  export interface IProps {
    agent: Agentica | MicroAgentica;
    title?: string;
  }
}
