import type { AgenticaHistory } from "@agentica/core";

import { AgenticaChatAssistantMessageMovie } from "./AgenticaChatAssistantMessageMovie";
import { AgenticaChatDescribeMessageMovie } from "./AgenticaChatDescribeMessageMovie";
import { AgenticaChatSelectMessageMovie } from "./AgenticaChatSelectMessageMovie";
import { AgenticaChatSystemMessageMovie } from "./AgenticaChatSystemMessageMovie";
import { AgenticaChatUserMessageMovie } from "./AgenticaChatUserMessageMovie";

export function AgenticaChatMessageMovie({
  prompt,
}: AgenticaChatMessageMovie.IProps) {
  if (prompt.type === "assistantMessage") {
    return <AgenticaChatAssistantMessageMovie prompt={prompt} />;
  }

  if (prompt.type === "select") {
    return <AgenticaChatSelectMessageMovie selection={prompt.selection} />;
  }

  if (prompt.type === "describe") {
    return <AgenticaChatDescribeMessageMovie history={prompt} />;
  }

  if (prompt.type === "cancel" || prompt.type === "execute") {
    return null;
  }

  if (prompt.type === "userMessage") {
    return <AgenticaChatUserMessageMovie prompt={prompt} />;
  }

  if (prompt.type === "systemMessage") {
    return <AgenticaChatSystemMessageMovie prompt={prompt} />;
  }

  prompt satisfies never;
  return null;
}
export namespace AgenticaChatMessageMovie {
  export interface IProps {
    prompt: AgenticaHistory;
  }
}
