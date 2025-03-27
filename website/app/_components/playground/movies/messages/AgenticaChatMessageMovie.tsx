import { AgenticaPrompt } from "@agentica/core";
import { ILlmSchema } from "@samchon/openapi";

import { AgenticaChatDescribeMessageMovie } from "./AgenticaChatDescribeMessageMovie";
import { AgenticaChatSelectMessageMovie } from "./AgenticaChatSelectMessageMovie";
import { AgenticaChatTextMessageMovie } from "./AgenticaChatTextMessageMovie";

export const AgenticaChatMessageMovie = <Model extends ILlmSchema.Model>({
  prompt,
}: IProps<Model>) => {
  if (prompt.type === "text")
    return <AgenticaChatTextMessageMovie prompt={prompt} />;
  else if (prompt.type === "select")
    return prompt.selections.map((selection, idx) => (
      <AgenticaChatSelectMessageMovie key={`idx-${idx}`} selection={selection} />
    ));
  else if (prompt.type === "describe")
    return <AgenticaChatDescribeMessageMovie prompt={prompt} />;
  return null;
};

interface IProps<Model extends ILlmSchema.Model> {
  prompt: AgenticaPrompt<Model>;
}

