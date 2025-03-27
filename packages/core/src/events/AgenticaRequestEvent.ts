import type OpenAI from "openai";

import type { IAgenticaEventJson } from "../json";
import type { AgenticaEventSource } from "./AgenticaEventSource";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaRequestEvent extends AgenticaEventBase<"request"> {
  public readonly source: AgenticaEventSource;
  public readonly body: OpenAI.ChatCompletionCreateParamsStreaming;
  public readonly options?: OpenAI.RequestOptions | undefined;

  public constructor(props: AgenticaRequestEvent.IProps) {
    super("request");
    this.source = props.source;
    this.body = props.body;
    this.options = props.options;
  }

  public toJSON(): IAgenticaEventJson.IRequest {
    return {
      type: "request",
      source: this.source,
      body: this.body,
      options: this.options,
    };
  }
}
export namespace AgenticaRequestEvent {
  export interface IProps {
    /**
     * The source agent of the request.
     */
    source: AgenticaEventSource;

    /**
     * Request body.
     */
    body: OpenAI.ChatCompletionCreateParamsStreaming;

    /**
     * Options for the request.
     */
    options?: OpenAI.RequestOptions | undefined;
  }
}
