import { utils } from "@agentica/core";

export async function test_stream_reduce(): Promise<void | false> {
  // Test case 1: String concatenation
  const stringStream = createNumberStream(1, 3);
  const stringResult = await utils.StreamUtil.reduce<number, string>(
    stringStream,
    (acc, cur) => acc + cur.toString(),
    "",
  );

  if (stringResult !== "123") {
    throw new Error(
      `String concatenation test failed: Expected "123", got "${stringResult}"`,
    );
  }

  // Test case 2: Number sum
  const sumStream = createNumberStream(1, 5);
  const sumResult = await utils.StreamUtil.reduce<number, number>(
    sumStream,
    (acc, cur) => acc + cur,
    0,
  );

  if (sumResult !== 15) {
    throw new Error(`Number sum test failed: Expected 15, got ${sumResult}`);
  }

  // Test case 3: Without initial value
  const noInitialStream = createNumberStream(1, 4);
  const noInitialResult = await utils.StreamUtil.reduce<number>(
    noInitialStream,
    (acc, cur) => acc + cur,
  );

  if (noInitialResult !== 10) {
    throw new Error(
      `Test without initial value failed: Expected 10, got ${noInitialResult}`,
    );
  }

  // Test case 4: Empty stream
  const emptyStream = createEmptyStream<number>();
  const emptyResult = await utils.StreamUtil.reduce<number, string>(
    emptyStream,
    (acc, cur) => acc + cur.toString(),
    "initial value",
  );

  if (emptyResult !== "initial value") {
    throw new Error(
      `Empty stream test failed: Expected "initial value", got "${emptyResult}"`,
    );
  }

  // Test case 5: Empty stream without initial value
  const emptyNoInitialStream = createEmptyStream<number>();
  const emptyNoInitialResult = await utils.StreamUtil.reduce<number>(
    emptyNoInitialStream,
    (acc, cur) => acc + cur,
  );

  if (emptyNoInitialResult !== null) {
    throw new Error(
      `Empty stream test without initial value failed: Expected null, got ${emptyNoInitialResult === null ? "null" : emptyNoInitialResult}`,
    );
  }
}

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
