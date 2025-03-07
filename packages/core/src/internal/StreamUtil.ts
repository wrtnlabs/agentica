export namespace StreamUtil {
  export const reduce = async <T, R = T>(
    stream: ReadableStream<T>,
    reducer: (acc: T | R, cur: T) => R,
    initial?: R,
  ): Promise<R | null> => {
    const reader = stream.getReader();

    let acc = (initial ?? null) as R | null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (acc === null) {
        acc = value as unknown as R;
        continue;
      }

      acc = reducer(acc, value);
    }

    return acc as R;
  };

  export const to = <T>(value: T): ReadableStream<T> => {
    const stream = new ReadableStream<T>({
      start: (controller) => {
        controller.enqueue(value);
        controller.close();
      },
    });

    return stream;
  };

  export const transform = <T, R>(
    stream: ReadableStream<T>,
    transformer: (value: T) => R,
  ): ReadableStream<R> => {
    const reader = stream.getReader();

    return new ReadableStream<R>({
      pull: async (controller) => {
        console.log("pull", new Error().stack);
        const { done, value } = await reader.read();
        if (!done) {
          controller.enqueue(transformer(value));
        } else {
          controller.close();
        }
      },
    });
  };
}
