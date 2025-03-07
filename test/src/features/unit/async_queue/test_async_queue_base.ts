import { MPSCUtil } from "@agentica/core/src/internal/MPSCUtil";

export async function test_async_queue_base(): Promise<void | false> {
  // Test case 1: Basic AsyncQueue functionality
  const basicQueue = new MPSCUtil.AsyncQueue<number>();
  basicQueue.enqueue(1);
  basicQueue.enqueue(2);
  basicQueue.enqueue(3);

  const result1 = await basicQueue.dequeue();
  const result2 = await basicQueue.dequeue();
  const result3 = await basicQueue.dequeue();

  if (result1.value !== 1 || result1.done !== false) {
    throw new Error(
      `Basic dequeue test failed: Expected {value: 1, done: false}, got ${JSON.stringify(result1)}`,
    );
  }

  if (result2.value !== 2 || result2.done !== false) {
    throw new Error(
      `Basic dequeue test failed: Expected {value: 2, done: false}, got ${JSON.stringify(result2)}`,
    );
  }

  if (result3.value !== 3 || result3.done !== false) {
    throw new Error(
      `Basic dequeue test failed: Expected {value: 3, done: false}, got ${JSON.stringify(result3)}`,
    );
  }

  // Test case 2: Dequeue from empty queue then enqueue
  const emptyQueue = new MPSCUtil.AsyncQueue<string>();

  // Start dequeue operation that will wait for an item
  const pendingDequeue = emptyQueue.dequeue();

  // Add item after a small delay
  setTimeout(() => {
    emptyQueue.enqueue("delayed item");
  }, 10);

  const delayedResult = await pendingDequeue;

  if (delayedResult.value !== "delayed item" || delayedResult.done !== false) {
    throw new Error(
      `Empty queue then enqueue test failed: Expected {value: "delayed item", done: false}, got ${JSON.stringify(delayedResult)}`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const duplicatedResult: false | IteratorResult<string, undefined> =
    (await Promise.race([
      emptyQueue.dequeue(),
      new Promise((resolve) => setTimeout(resolve, 0, false)),
    ])) as any;

  if (
    duplicatedResult !== false &&
    duplicatedResult.value === "delayed item" &&
    duplicatedResult.done === false
  ) {
    throw new Error(
      `Duplicated dequeue test failed: Expected {value: "delayed item", done: false}, got ${JSON.stringify(duplicatedResult)}`,
    );
  }

  // Test case 3: Close queue
  const closeQueue = new MPSCUtil.AsyncQueue<number>();
  closeQueue.enqueue(42);
  closeQueue.close();

  const beforeCloseResult = await closeQueue.dequeue();
  const afterCloseResult = await closeQueue.dequeue();

  if (beforeCloseResult.value !== 42 || beforeCloseResult.done !== false) {
    throw new Error(
      `Queue close test (before) failed: Expected {value: 42, done: false}, got ${JSON.stringify(beforeCloseResult)}`,
    );
  }

  if (afterCloseResult.value !== undefined || afterCloseResult.done !== true) {
    throw new Error(
      `Queue close test (after) failed: Expected {value: undefined, done: true}, got ${JSON.stringify(afterCloseResult)}`,
    );
  }

  // Test case 4: Wait for close
  const waitCloseQueue = new MPSCUtil.AsyncQueue<string>();

  // Start waiting for close
  const closePromise = waitCloseQueue.waitClose();

  // Close after delay
  setTimeout(() => {
    waitCloseQueue.close();
  }, 10);

  await closePromise; // Should resolve when queue is closed

  // Test case 5: Test create function - basic functionality
  const { consumer, produce, close } = MPSCUtil.create<number>();
  const reader = consumer.getReader();

  // Produce values
  produce(10);
  produce(20);
  produce(30);

  const read1 = await reader.read();
  const read2 = await reader.read();
  const read3 = await reader.read();

  if (read1.value !== 10 || read1.done !== false) {
    throw new Error(
      `MPSC create test failed: Expected {value: 10, done: false}, got ${JSON.stringify(read1)}`,
    );
  }

  if (read2.value !== 20 || read2.done !== false) {
    throw new Error(
      `MPSC create test failed: Expected {value: 20, done: false}, got ${JSON.stringify(read2)}`,
    );
  }

  if (read3.value !== 30 || read3.done !== false) {
    throw new Error(
      `MPSC create test failed: Expected {value: 30, done: false}, got ${JSON.stringify(read3)}`,
    );
  }

  // Test case 6: Test create function - close
  close();
  const readAfterClose = await reader.read();

  if (readAfterClose.done !== true) {
    throw new Error(
      `MPSC close test failed: Expected {done: true}, got ${JSON.stringify(readAfterClose)}`,
    );
  }

  // Test case 7: Multiple producers
  const {
    consumer: multiConsumer,
    produce: multiProduce,
    close: multiClose,
    waitClose: multiWaitClose,
  } = MPSCUtil.create<string>();
  const multiReader = multiConsumer.getReader();

  // Simulate multiple producers
  for (let i = 1; i <= 5; i++) {
    multiProduce(`producer-${i}`);
  }

  // Read all values
  const multiResults: string[] = [];
  for (let i = 0; i < 5; i++) {
    const { value } = await multiReader.read();
    if (value) multiResults.push(value);
  }

  if (
    multiResults.length !== 5 ||
    !multiResults.includes("producer-1") ||
    !multiResults.includes("producer-2") ||
    !multiResults.includes("producer-3") ||
    !multiResults.includes("producer-4") ||
    !multiResults.includes("producer-5")
  ) {
    throw new Error(
      `Multiple producers test failed: Expected 5 values from producers, got ${JSON.stringify(multiResults)}`,
    );
  }

  // Test waitClose functionality
  const waitClosePromise = multiWaitClose();
  multiClose();
  await waitClosePromise; // Should resolve when closed

  const multiAfterClose = await multiReader.read();
  if (multiAfterClose.done !== true) {
    throw new Error(
      `MPSC waitClose test failed: Expected {done: true}, got ${JSON.stringify(multiAfterClose)}`,
    );
  }
}
