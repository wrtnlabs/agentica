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

  let acc = (initial ?? null) as R | null | T;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (acc === null) {
      acc = value;
      continue;
    }

    acc = reducer(acc, value);
  }

  return acc as R;
}

function to<T>(value: T): ReadableStream<T> {
  const stream = new ReadableStream<T>({
    start: (controller) => {
      controller.enqueue(value);
      controller.close();
    },
  });

  return stream;
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
  to,
  transform,
};
