/**
 * @module StreamUtil
 *
 * Utility functions for streams.
 */

async function readAll<T>(stream: ReadableStream<T>): Promise<T[]> {
  const reader = stream.getReader();
  const result: T[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result.push(value);
  }
  return result;
}

async function reduce<T, R = T>(stream: ReadableStream<T>, reducer: (acc: T | R, cur: T) => R, initial?: R): Promise<R | null> {
  const reader = stream.getReader();
  const iterator = streamDefaultReaderToAsyncGenerator(reader);
  let acc = (initial ?? null) as R | null | T;

  for await (const value of iterator) {
    if (acc === null) {
      acc = value;
      continue;
    }

    acc = reducer(acc, value);
  }

  return acc as R;
}

function from<T>(...value: T[]): ReadableStream<T> {
  const stream = new ReadableStream<T>({
    start: (controller) => {
      value.forEach(v => controller.enqueue(v));
      controller.close();
    },
  });

  return stream;
}

export async function* toAsyncGenerator<T>(value: T): AsyncGenerator<T, undefined, undefined> {
  yield value;
}

export async function* streamDefaultReaderToAsyncGenerator<T>(reader: ReadableStreamDefaultReader<T>): AsyncGenerator<Awaited<T>, undefined, undefined> {
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    yield value;
  }
}

function transform<T, R>(stream: ReadableStream<T>, transformer: (value: T) => R): ReadableStream<R> {
  const reader = stream.getReader();

  return new ReadableStream<R>({
    pull: async (controller) => {
      const { done, value } = await reader.read();
      if (!done) {
        controller.enqueue(transformer(value));
      }
      else {
        controller.close();
      }
    },
  });
}

export const StreamUtil = {
  readAll,
  reduce,
  from,
  transform,
};
