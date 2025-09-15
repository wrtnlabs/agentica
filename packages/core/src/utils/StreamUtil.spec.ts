import { streamDefaultReaderToAsyncGenerator, StreamUtil, toAsyncGenerator } from "./StreamUtil";

// Helper function to create a stream with numbers from start to end
function createNumberStream(
  start: number,
  end: number,
): ReadableStream<number> {
  return new ReadableStream<number>({
    start(controller) {
      for (let i = start; i <= end; i++) {
        controller.enqueue(i);
      }
      controller.close();
    },
  });
}

// Helper function to create an empty stream
function createEmptyStream<T>(): ReadableStream<T> {
  return new ReadableStream<T>({
    start(controller) {
      controller.close();
    },
  });
}

// Helper function to convert ReadableStream to array
async function streamToArray<T>(stream: ReadableStream<T>): Promise<T[]> {
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

// Helper function to create test stream
function createTestStream<T>(items: T[]): ReadableStream<T> {
  return new ReadableStream<T>({
    start(controller) {
      for (const item of items) {
        controller.enqueue(item);
      }
      controller.close();
    },
  });
}

// Delay function (for simulating async operations)
async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper function to create a stream with numbers from start to end asynchronously
async function createDelayedNumberStream(
  start: number,
  end: number,
  delayMs: number,
): Promise<ReadableStream<number>> {
  // Simulate async work
  await delay(delayMs);

  return new ReadableStream<number>({
    start(controller) {
      for (let i = start; i <= end; i++) {
        controller.enqueue(i);
      }
      controller.close();
    },
  });
}

// Helper function to create an empty stream asynchronously
async function createEmptyDelayedStream<T>(
  delayMs: number,
): Promise<ReadableStream<T>> {
  // Simulate async work
  await delay(delayMs);

  return new ReadableStream<T>({
    start(controller) {
      controller.close();
    },
  });
}

// Helper function to create a stream with items having various delay times
async function createVariableDelayedNumberStream(
  items: Array<{ value: number; delay: number }>,
): Promise<ReadableStream<number>> {
  // Wait for all items to be ready based on their delays
  await Promise.all(items.map(async item => delay(item.delay)));

  return new ReadableStream<number>({
    start(controller) {
      for (const item of items) {
        controller.enqueue(item.value);
      }
      controller.close();
    },
  });
}

describe("streamUtil", () => {
  describe("readAll", () => {
    it("should read all values from a stream", async () => {
      const stream = createNumberStream(1, 5);
      const result = await StreamUtil.readAll(stream);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should return empty array for empty stream", async () => {
      const stream = createEmptyStream<number>();
      const result = await StreamUtil.readAll(stream);

      expect(result).toEqual([]);
    });

    it("should handle error in stream", async () => {
      const stream = new ReadableStream<number>({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          controller.error(new Error("Stream error"));
        },
      });

      await expect(StreamUtil.readAll(stream)).rejects.toThrow("Stream error");
    });

    it("should handle null or undefined values in stream", async () => {
      const stream = createTestStream<number | null | undefined>([1, null, 3, undefined, 5]);

      const result = await StreamUtil.readAll(stream);
      expect(result).toEqual([1, null, 3, undefined, 5]);
    });
  });

  describe("reduce", () => {
    it("should concatenate strings from number stream", async () => {
      const stringStream = createNumberStream(1, 3);
      const stringResult = await StreamUtil.reduce<number, string>(
        stringStream,
        (acc, cur) => acc + cur.toString(),
        { initial: ""},
      );

      expect(stringResult).toBe("123");
    });

    it("should sum numbers from stream", async () => {
      const sumStream = createNumberStream(1, 5);
      const sumResult = await StreamUtil.reduce<number, number>(
        sumStream,
        (acc, cur) => acc + cur,
        { initial: 0 },
      );

      expect(sumResult).toBe(15);
    });

    it("should work without initial value", async () => {
      const noInitialStream = createNumberStream(1, 4);
      const noInitialResult = await StreamUtil.reduce<number>(
        noInitialStream,
        (acc, cur) => acc + cur,
        { initial: 0 },
      );

      expect(noInitialResult).toBe(10);
    });

    it("should return initial value for empty stream", async () => {
      const emptyStream = createEmptyStream<number>();
      const emptyResult = await StreamUtil.reduce<number, string>(
        emptyStream,
        (acc, cur) => acc + cur.toString(),
        { initial: "initial value" },
      );

      expect(emptyResult).toBe("initial value");
    });

    it("should work with async generated stream", async () => {
      const stringStream = await createDelayedNumberStream(1, 3, 10);
      const stringResult = await StreamUtil.reduce<number, string>(
        stringStream,
        (acc, cur) => acc + cur.toString(),
        { initial: "" },
      );

      expect(stringResult).toBe("123");
    });

    it("should work with async stream without initial value", async () => {
      const noInitialStream = await createDelayedNumberStream(1, 4, 15);
      const noInitialResult = await StreamUtil.reduce<number>(
        noInitialStream,
        (acc, cur) => acc + cur,
        { initial: 0 },
      );

      expect(noInitialResult).toBe(10);
    });

    it("should work with async stream transformation and aggregation into array", async () => {
      const transformStream = await createDelayedNumberStream(1, 3, 10);
      const transformResult = await StreamUtil.reduce<number, string[]>(
        transformStream,
        (acc: string[] | number, cur: number): string[] => {
          if (typeof acc === "number") {
            // Handle case when no initial value is provided
            return [`item${acc}`, `item${cur}`];
          }
          return [...acc, `item${cur}`];
        },
        { initial: [] },
      );

      expect(transformResult).toEqual(["item1", "item2", "item3"]);
    });

    it("should return initial value for async generated empty stream", async () => {
      const emptyStream = await createEmptyDelayedStream<number>(30);
      const emptyResult = await StreamUtil.reduce<number, string>(
        emptyStream,
        (acc, cur) => acc + cur.toString(),
        { initial: "initial" },
      );

      expect(emptyResult).toBe("initial");
    });

    it("should work with stream with values created with various async delays", async () => {
      const delayStream = await createVariableDelayedNumberStream([
        { value: 1, delay: 20 },
        { value: 2, delay: 40 },
        { value: 3, delay: 10 },
      ]);

      const delayResult = await StreamUtil.reduce<number, number>(
        delayStream,
        (acc, cur) => acc + cur,
        { initial: 0 },
      );

      expect(delayResult).toBe(6);
    });

    it("should handle error in reducer function", async () => {
      const stream = createNumberStream(1, 3);

      await expect(
        StreamUtil.reduce<number, number>(
          stream,
          (acc, cur) => {
            if (cur === 2) {
              throw new Error("Test error");
            }
            return acc + cur;
          },
          { initial: 0 },
        ),
      ).rejects.toThrow("Test error");
    });

    it("should handle null or undefined values in stream", async () => {
      const stream = createTestStream<number | null | undefined>([1, null, 3, undefined, 5]);

      const result = await StreamUtil.reduce<number | null | undefined, number>(
        stream,
        (acc, cur) => (acc ?? 0) + (cur ?? 0),
        { initial: 0 },
      );

      expect(result).toBe(9); // 1 + 0 + 3 + 0 + 5 = 9
    });
  });

  describe("from", () => {
    it("should create a stream with a single value", async () => {
      const stream = StreamUtil.from("Hello, world!");
      const reader = stream.getReader();
      const { done, value } = await reader.read();

      expect(done).toBe(false);
      expect(value).toBe("Hello, world!");

      const next = await reader.read();
      expect(next.done).toBe(true);
    });

    it("should handle null or undefined values", async () => {
      const stream = StreamUtil.from(null);
      const reader = stream.getReader();
      const { done, value } = await reader.read();

      expect(done).toBe(false);
      expect(value).toBeNull();

      const next = await reader.read();
      expect(next.done).toBe(true);
    });
  });

  describe("transform", () => {
    it("should transform number stream by doubling", async () => {
      const numbersInput = [1, 2, 3, 4, 5];
      const numberStream = createTestStream(numbersInput);

      const doubledStream = StreamUtil.transform(
        numberStream,
        (num: number) => num * 2,
      );

      const doubledResult = await streamToArray(doubledStream);
      const expectedDoubled = numbersInput.map(n => n * 2);

      expect(doubledResult).toEqual(expectedDoubled);
    });

    it("should transform object stream", async () => {
      const objectsInput = [
        { name: "item1", value: 10 },
        { name: "item2", value: 20 },
        { name: "item3", value: 30 },
      ];

      const objectStream = createTestStream(objectsInput);

      const transformedObjectStream = StreamUtil.transform(objectStream, obj => ({
        id: obj.name.toUpperCase(),
        doubledValue: obj.value * 2,
      }));

      const transformedObjects = await streamToArray(transformedObjectStream);
      const expectedObjects = objectsInput.map(obj => ({
        id: obj.name.toUpperCase(),
        doubledValue: obj.value * 2,
      }));

      expect(transformedObjects).toEqual(expectedObjects);
    });

    it("should handle empty stream", async () => {
      const emptyStream = createEmptyStream<number>();
      const transformedEmptyStream = StreamUtil.transform(
        emptyStream,
        n => n * 2,
      );

      const emptyResult = await streamToArray(transformedEmptyStream);

      expect(emptyResult).toEqual([]);
    });

    it("should transform type (number -> string)", async () => {
      const numbersInput = [1, 2, 3, 4, 5];
      const numberStream = createTestStream(numbersInput);

      const stringStream = StreamUtil.transform(
        numberStream,
        num => `Number: ${num}`,
      );

      const stringResult = await streamToArray(stringStream);
      const expectedStrings = numbersInput.map(n => `Number: ${n}`);

      expect(stringResult).toEqual(expectedStrings);
    });

    it("should handle error in transformer function", async () => {
      const stream = createNumberStream(1, 3);

      const transformedStream = StreamUtil.transform(
        stream,
        (num) => {
          if (num === 2) {
            throw new Error("Transform error");
          }
          return num * 2;
        },
      );

      await expect(streamToArray(transformedStream)).rejects.toThrow("Transform error");
    });

    it("should handle null or undefined values in stream", async () => {
      const stream = createTestStream<number | null | undefined>([1, null, 3, undefined, 5]);

      const transformedStream = StreamUtil.transform(
        stream,
        num => (num ?? 0) * 2,
      );

      const result = await streamToArray(transformedStream);
      expect(result).toEqual([2, 0, 6, 0, 10]);
    });
  });

  describe("toAsyncGenerator", () => {
    it("should yield a single value", async () => {
      const generator = toAsyncGenerator("test value");
      const result = [];

      for await (const value of generator) {
        result.push(value);
      }

      expect(result).toEqual(["test value"]);
    });

    it("should handle null or undefined values", async () => {
      const generator = toAsyncGenerator(null);
      const result = [];

      for await (const value of generator) {
        result.push(value);
      }

      expect(result).toEqual([null]);
    });

    it("should handle object values", async () => {
      const testObj = { id: 1, name: "test" };
      const generator = toAsyncGenerator(testObj);
      const result = [];

      for await (const value of generator) {
        result.push(value);
      }

      expect(result).toEqual([testObj]);
    });
  });

  describe("streamDefaultReaderToAsyncGenerator", () => {
    it("should convert stream reader to async generator", async () => {
      const stream = createNumberStream(1, 5);
      const reader = stream.getReader();
      const generator = streamDefaultReaderToAsyncGenerator(reader);
      const result = [];

      for await (const value of generator) {
        result.push(value);
      }

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle empty stream", async () => {
      const stream = createEmptyStream<number>();
      const reader = stream.getReader();
      const generator = streamDefaultReaderToAsyncGenerator(reader);
      const result = [];

      for await (const value of generator) {
        result.push(value);
      }

      expect(result).toEqual([]);
    });

    it("should handle null or undefined values in stream", async () => {
      const stream = createTestStream<number | null | undefined>([1, null, 3, undefined, 5]);
      const reader = stream.getReader();
      const generator = streamDefaultReaderToAsyncGenerator(reader);
      const result = [];

      for await (const value of generator) {
        result.push(value);
      }

      expect(result).toEqual([1, null, 3, undefined, 5]);
    });

    it("should handle error in stream", async () => {
      const stream = new ReadableStream<number>({
        start(controller) {
          controller.enqueue(1);
          controller.enqueue(2);
          delay(1000).then(() => controller.error(new Error("Stream error"))).catch(() => {});
        },
      });

      const reader = stream.getReader();
      const generator = streamDefaultReaderToAsyncGenerator(reader);
      const result = [];

      try {
        for await (const value of generator) {
          result.push(value);
        }
        // Should not reach here
        expect(true).toBe(false);
      }
      catch (error) {
        console.error(error);
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Stream error");
        expect(result).toEqual([1, 2]);
      }
    });
  });
});
