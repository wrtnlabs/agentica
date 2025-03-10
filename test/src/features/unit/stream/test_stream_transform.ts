import { StreamUtil } from "@agentica/core/src/internal/StreamUtil";

/**
 * Helper function to convert ReadableStream to array
 */
async function streamToArray<T>(stream: ReadableStream<T>): Promise<T[]> {
  const reader = stream.getReader();
  const result: T[] = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result.push(value);
  }

  return result;
}

/**
 * Helper function to create test stream
 */
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

export async function test_stream_transform(): Promise<void> {
  // Test case 1: Transform number stream by doubling
  const numbersInput = [1, 2, 3, 4, 5];
  const numberStream = createTestStream(numbersInput);

  const doubledStream = StreamUtil.transform(
    numberStream,
    (num: number) => num * 2,
  );

  const doubledResult = await streamToArray(doubledStream);
  const expectedDoubled = numbersInput.map((n) => n * 2);

  // Check results
  if (doubledResult.length !== expectedDoubled.length) {
    throw new Error(
      `Stream transform result length does not match expected: ${doubledResult.length} !== ${expectedDoubled.length}`,
    );
  }

  for (let i = 0; i < doubledResult.length; i++) {
    if (doubledResult[i] !== expectedDoubled[i]) {
      throw new Error(
        `Stream transform result does not match expected: at index ${i}, ${doubledResult[i]} !== ${expectedDoubled[i]}`,
      );
    }
  }

  // Test case 2: Transform object stream
  const objectsInput = [
    { name: "item1", value: 10 },
    { name: "item2", value: 20 },
    { name: "item3", value: 30 },
  ];

  const objectStream = createTestStream(objectsInput);

  const transformedObjectStream = StreamUtil.transform(objectStream, (obj) => ({
    id: obj.name.toUpperCase(),
    doubledValue: obj.value * 2,
  }));

  const transformedObjects = await streamToArray(transformedObjectStream);
  const expectedObjects = objectsInput.map((obj) => ({
    id: obj.name.toUpperCase(),
    doubledValue: obj.value * 2,
  }));

  // Check results
  if (transformedObjects.length !== expectedObjects.length) {
    throw new Error(
      "Object stream transform result length does not match expected",
    );
  }

  for (let i = 0; i < transformedObjects.length; i++) {
    if (
      transformedObjects[i]?.id !== expectedObjects[i]?.id ||
      transformedObjects[i]?.doubledValue !== expectedObjects[i]?.doubledValue
    ) {
      throw new Error(
        `Object stream transform result does not match expected at index ${i}`,
      );
    }
  }

  // Test case 3: Transform empty stream
  const emptyStream = createTestStream<number>([]);
  const transformedEmptyStream = StreamUtil.transform(
    emptyStream,
    (n) => n * 2,
  );

  const emptyResult = await streamToArray(transformedEmptyStream);

  if (emptyResult.length !== 0) {
    throw new Error(
      `Empty stream transform result is not empty: ${emptyResult.length}`,
    );
  }

  // Test case 4: Type transformation (number -> string)
  const numbersForStringStream = createTestStream([1, 2, 3, 4, 5]);
  const stringStream = StreamUtil.transform(
    numbersForStringStream,
    (num) => `Number: ${num}`,
  );

  const stringResult = await streamToArray(stringStream);
  const expectedStrings = numbersInput.map((n) => `Number: ${n}`);

  if (stringResult.length !== expectedStrings.length) {
    throw new Error(
      "Type transformation stream result length does not match expected",
    );
  }

  for (let i = 0; i < stringResult.length; i++) {
    if (stringResult[i] !== expectedStrings[i]) {
      throw new Error(
        `Type transformation result does not match expected at index ${i}`,
      );
    }
  }
}
