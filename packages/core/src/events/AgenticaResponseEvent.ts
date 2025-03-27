import type OpenAI from "openai";

import type { AgenticaEventSource } from "./AgenticaEventSource";
import { AgenticaEventBase } from "./AgenticaEventBase";

export class AgenticaResponseEvent extends AgenticaEventBase<"response"> {
  public readonly source: AgenticaEventSource;
  public readonly body: OpenAI.ChatCompletionCreateParamsStreaming;
  public readonly stream: ReadableStream<OpenAI.ChatCompletionChunk>;
  public readonly options?: OpenAI.RequestOptions | undefined;
  public readonly join: () => Promise<OpenAI.ChatCompletion>;

  public constructor(props: AgenticaResponseEvent.IProps) {
    super("response");
    this.source = props.source;
    this.body = props.body;
    this.stream = props.stream;
    this.options = props.options;
    this.join = props.join;
  }
}
export namespace AgenticaResponseEvent {
  export interface IProps {
    /**
     * The source agent of the response.
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
    /**
     * The text content stream.
     */
    stream: ReadableStream<OpenAI.ChatCompletionChunk>;

    /**
     * Get the description text.
     */
    join: () => Promise<OpenAI.ChatCompletion>;
  }
}
