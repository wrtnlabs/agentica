import type { AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatDescribeMessageMovie } from "./AgenticaChatDescribeMessageMovie";
import { AgenticaChatSelectMessageMovie } from "./AgenticaChatSelectMessageMovie";
import { AgenticaChatTextMessageMovie } from "./AgenticaChatTextMessageMovie";
import { AgenticaChatUserInput } from "./AgenticaChatUserInput";

export function AgenticaChatMessageMovie<Model extends ILlmSchema.Model>({
  prompt,
}: AgenticaChatMessageMovie.IProps<Model>) {
  if (prompt.type === "text") {
    return <AgenticaChatTextMessageMovie prompt={prompt} />;
  }

  if (prompt.type === "select") {
    return prompt.selections.map(selection => (
      <AgenticaChatSelectMessageMovie selection={selection} />
    ));
  }

  if (prompt.type === "describe") {
    return <AgenticaChatDescribeMessageMovie history={prompt} />;
  }

  if (prompt.type === "cancel" || prompt.type === "execute") {
    return null;
  }

  if (prompt.type === "user_input") {
    return <AgenticaChatUserInput prompt={prompt} />;
  }

  prompt satisfies never;

  return null;
}
export namespace AgenticaChatMessageMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    prompt: AgenticaHistory<Model>;
  }
}
