import type OpenAI from "openai";

export type AgenticaContextRequestResult = AgenticaContextRequestResult.Stream | AgenticaContextRequestResult.NoneStream;

export namespace AgenticaContextRequestResult {
  export interface Stream {
    type: "stream";
    value: ReadableStream<OpenAI.Chat.Completions.ChatCompletionChunk>;
  }
  export interface NoneStream {
    type: "none-stream";
    value: OpenAI.ChatCompletion;
  }
}
