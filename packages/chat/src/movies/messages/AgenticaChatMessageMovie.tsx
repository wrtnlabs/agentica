import type { AgenticaHistory } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatAssistantMessageMovie } from "./AgenticaChatAssistantMessageMovie";
import { AgenticaChatDescribeMessageMovie } from "./AgenticaChatDescribeMessageMovie";
import { AgenticaChatSelectMessageMovie } from "./AgenticaChatSelectMessageMovie";
import { AgenticaChatUserMessageMovie } from "./AgenticaChatUserMessageMovie";

export function AgenticaChatMessageMovie<Model extends ILlmSchema.Model>({
  prompt,
}: AgenticaChatMessageMovie.IProps<Model>) {
  if (prompt.type === "assistant") {
    return <AgenticaChatAssistantMessageMovie prompt={prompt} />;
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

  if (prompt.type === "user") {
    return <AgenticaChatUserMessageMovie prompt={prompt} />;
  }

  prompt satisfies never;

  return null;
}
export namespace AgenticaChatMessageMovie {
  export interface IProps<Model extends ILlmSchema.Model> {
    prompt: AgenticaHistory<Model>;
  }
}
