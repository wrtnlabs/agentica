import type { AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatDescribeMessageMovie } from "./AgenticaChatDescribeMessageMovie";
import { AgenticaChatSelectMessageMovie } from "./AgenticaChatSelectMessageMovie";
import { AgenticaChatTextMessageMovie } from "./AgenticaChatTextMessageMovie";

export function AgenticaChatMessageMovie<Model extends ILlmSchema.Model>({
  prompt,
}: AgenticaChatMessageMovie.IProps<Model>) {
  if (prompt.type === "text") {
    return <AgenticaChatTextMessageMovie prompt={prompt} />;
  }
  else if (prompt.type === "select") {
    return prompt.selections.map(selection => (
      <AgenticaChatSelectMessageMovie selection={selection} />
    ));
  }
  else if (prompt.type === "describe") {
    return <AgenticaChatDescribeMessageMovie history={prompt} />;
  }
  return null;
}
export namespace AgenticaChatMessageMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    prompt: AgenticaHistory<Model>;
  }
}
