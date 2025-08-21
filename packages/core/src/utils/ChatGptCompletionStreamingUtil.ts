import { ChatCompletion, ChatCompletionChunk } from "openai/resources";

import { ChatGptCompletionMessageUtil, MPSC, streamDefaultReaderToAsyncGenerator, StreamUtil } from ".";

async function reduceStreamingWithDispatch(stream: ReadableStream<ChatCompletionChunk>, eventProcessor: (props:  {
  stream: AsyncGenerator<string, undefined, undefined>;
  done: () => boolean;
  get: () => string;
  join: () => Promise<string>;
}) => void) {
  const streamContext = new Map<number, { content: string; mpsc: MPSC<string>; }>();

  const nullableCompletion = await StreamUtil.reduce<ChatCompletionChunk, Promise<ChatCompletion>>(stream, async (accPromise, chunk) => {
    const acc = await accPromise;

    const registerContext = (
      choices: ChatCompletionChunk.Choice[],
    ) => {
      for (const choice of choices) {
        /**
         * @TODO fix it
         * Sometimes, the complete message arrives along with a finish reason.
         */
        if (choice.finish_reason != null) {
          const context = streamContext.get(choice.index);
          if (context != null) {
            context.mpsc.close();
          }
          continue;
        }

        if (choice.delta.content == null || choice.delta.content === "") {
          continue;
        }

        if (streamContext.has(choice.index)) {
          const context = streamContext.get(choice.index)!;
          context.content += choice.delta.content;
          context.mpsc.produce(choice.delta.content);
          continue;
        }

        const mpsc = new MPSC<string>();

        streamContext.set(choice.index, {
          content: choice.delta.content,
          mpsc,
        });
        mpsc.produce(choice.delta.content);



        eventProcessor({
          stream: streamDefaultReaderToAsyncGenerator(mpsc.consumer.getReader()),
          done: () => mpsc.done(),
          get: () => streamContext.get(choice.index)?.content ?? "",
          join: async () => {
            await mpsc.waitClosed();
            return streamContext.get(choice.index)!.content;
          },
        });
      }
    };
    if (acc.object === "chat.completion.chunk") {
      registerContext([acc, chunk].flatMap(v => v.choices));
      return ChatGptCompletionMessageUtil.merge([acc, chunk]);
    }
    registerContext(chunk.choices);
    return ChatGptCompletionMessageUtil.accumulate(acc, chunk);
  });

  return nullableCompletion!;
}

export { reduceStreamingWithDispatch };