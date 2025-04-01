import { StreamUtil } from "@agentica/core/src/utils/StreamUtil";

export async function test_stream_reduce_async(): Promise<void | false> {
  // Test case 1: String concatenation with async generated stream
  const stringStream = await createDelayedNumberStream(1, 3, 10);
  const stringResult = await StreamUtil.reduce<number, string>(
    stringStream,
    (acc, cur) => acc + cur.toString(),
    "",
  );

  if (stringResult !== "123") {
    throw new Error(
      `Async stream string concatenation test failed: Expected "123", got "${stringResult}"`,
    );
  }

  // Test case 2: Number sum with async generated stream
  const sumStream = await createDelayedNumberStream(1, 5, 20);
  const sumResult = await StreamUtil.reduce<number, number>(
    sumStream,
    (acc, cur) => acc + cur,
    0,
  );

  if (sumResult !== 15) {
    throw new Error(
      `Async stream number sum test failed: Expected 15, got ${sumResult}`,
    );
  }

  // Test case 3: Using async stream without initial value
  const noInitialStream = await createDelayedNumberStream(1, 4, 15);
  const noInitialResult = await StreamUtil.reduce<number>(
    noInitialStream,
    (acc, cur) => acc + cur,
  );

  if (noInitialResult !== 10) {
    throw new Error(
      `Async stream without initial value test failed: Expected 10, got ${noInitialResult}`,
    );
  }

  // Test case 4: Async stream transformation and aggregation into array
  const transformStream = await createDelayedNumberStream(1, 3, 10);
  const transformResult = await StreamUtil.reduce<number, string[]>(
    transformStream,
    (acc: string[] | number, cur: number): string[] => {
      if (typeof acc === "number") {
        // Handle case when no initial value is provided (doesn't actually happen here)
        return [`item${acc}`, `item${cur}`];
      }
      return [...acc, `item${cur}`];
    },
    [],
  );

  if (
    transformResult === null
    || transformResult.length !== 3
    || transformResult[0] !== "item1"
    || transformResult[1] !== "item2"
    || transformResult[2] !== "item3"
  ) {
    throw new Error(
      `Async stream transformation test failed: Expected ["item1", "item2", "item3"], got ${JSON.stringify(
        transformResult,
      )}`,
    );
  }

  // Test case 5: Async generated empty stream
  const emptyStream = await createEmptyDelayedStream<number>(30);
  const emptyResult = await StreamUtil.reduce<number, string>(
    emptyStream,
    (acc, cur) => acc + cur.toString(),
    "initial",
  );

  if (emptyResult !== "initial") {
    throw new Error(
      `Async empty stream test failed: Expected "initial", got "${emptyResult}"`,
    );
  }

  // Test case 6: Stream with values created with various async delays
  const delayStream = await createVariableDelayedNumberStream([
    { value: 1, delay: 20 },
    { value: 2, delay: 40 },
    { value: 3, delay: 10 },
  ]);

  const delayResult = await StreamUtil.reduce<number, number>(
    delayStream,
    (acc, cur) => acc + cur,
    0,
  );

  if (delayResult !== 6) {
    throw new Error(
      `Various delay async stream test failed: Expected 6, got ${delayResult}`,
    );
  }
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
