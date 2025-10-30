import type { ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import { v4 } from "uuid";

import type { AgenticaTokenUsage } from "../context/AgenticaTokenUsage";
import type { AgenticaEventSource, AgenticaRequestEvent, AgenticaResponseEvent } from "../events";
import type { IAgenticaConfig, IAgenticaVendor, IMicroAgenticaConfig } from "../structures";

import { AgenticaTokenUsageAggregator } from "../context/internal/AgenticaTokenUsageAggregator";
import { createRequestEvent } from "../factory";

import { ChatGptCompletionMessageUtil } from "./ChatGptCompletionMessageUtil";
import { streamDefaultReaderToAsyncGenerator, StreamUtil } from "./StreamUtil";

export function getChatCompletionWithStreamingFunction<Model extends ILlmSchema.Model>(props: {
  vendor: IAgenticaVendor;
  config?: IAgenticaConfig<Model> | IMicroAgenticaConfig<Model>;
  dispatch: (event: AgenticaRequestEvent | AgenticaResponseEvent) => Promise<void>;
  abortSignal?: AbortSignal;
  usage: AgenticaTokenUsage;
}) {
  return async (
    source: AgenticaEventSource,
    body: Omit<OpenAI.ChatCompletionCreateParamsStreaming, "model" | "stream">,
  ) => {
    const event: AgenticaRequestEvent = createRequestEvent({
      source,
      body: {
        ...body,
        model: props.vendor.model,
        stream: true,
        stream_options: {
          include_usage: true,
        },
      },
      options: {
        ...props.vendor.options,
        signal: props.abortSignal,
      },
    });
    await props.dispatch(event);

    // completion
    const backoffStrategy = props.config?.backoffStrategy ?? ((props) => {
      throw props.error;
    });
    const completion = await (async () => {
      let count = 0;
      while (true) {
        try {
          return await props.vendor.api.chat.completions.create(
            event.body,
            event.options,
          );
        }
        catch (error) {
          const waiting = backoffStrategy({ count, error });
          await new Promise(resolve => setTimeout(resolve, waiting));
          count++;
        }
      }
    })();

    const [streamForEvent, temporaryStream] = StreamUtil.transform(
      completion.toReadableStream() as ReadableStream<Uint8Array>,
      value =>
        ChatGptCompletionMessageUtil.transformCompletionChunk(value),
      props.abortSignal,
    ).tee();

    const [streamForAggregate, streamForReturn] = temporaryStream.tee();

    (async () => {
      const reader = streamForAggregate.getReader();
      while (true) {
        const chunk = await reader.read();
        if (chunk.done || props.abortSignal?.aborted === true) {
          break;
        }
        if (chunk.value.usage != null) {
          AgenticaTokenUsageAggregator.aggregate({
            kind: source,
            completionUsage: chunk.value.usage,
            usage: props.usage,
          });
        }
      }
    })().catch(() => {});

    const [streamForStream, streamForJoin] = streamForEvent.tee();
    void props.dispatch({
      id: v4(),
      type: "response",
      request_id: event.id,
      source,
      stream: streamDefaultReaderToAsyncGenerator(streamForStream.getReader(), props.abortSignal),
      body: event.body,
      options: event.options,
      join: async () => {
        const chunks = await StreamUtil.readAll(streamForJoin, props.abortSignal);
        return ChatGptCompletionMessageUtil.merge(chunks);
      },
      created_at: new Date().toISOString(),
    }).catch(() => {});
    return streamForReturn;
  };
}
