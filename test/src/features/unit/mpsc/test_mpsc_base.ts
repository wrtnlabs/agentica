import { MPSCUtil } from "@agentica/core/src/internal/MPSCUtil";

export async function test_mpsc_base(): Promise<void | false> {
  // Test case 1: Basic MPSC functionality with create
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
      `Basic MPSC test failed: Expected {value: 10, done: false}, got ${JSON.stringify(
        read1,
      )}`,
    );
  }
  if (read2.value !== 20 || read2.done !== false) {
    throw new Error(
      `Basic MPSC test failed: Expected {value: 20, done: false}, got ${JSON.stringify(
        read2,
      )}`,
    );
  }
  if (read3.value !== 30 || read3.done !== false) {
    throw new Error(
      `Basic MPSC test failed: Expected {value: 30, done: false}, got ${JSON.stringify(
        read3,
      )}`,
    );
  }
  // Test case 2: Close functionality
  close();
  const readAfterClose = await reader.read();
  if (readAfterClose.done !== true) {
    throw new Error(
      `MPSC close test failed: Expected {done: true}, got ${JSON.stringify(
        readAfterClose,
      )}`,
    );
  }
  // Test case 3: waitClose functionality
  const {
    consumer: consumer2,
    produce: produce2,
    close: close2,
    waitClosed,
  } = MPSCUtil.create<string>();
  const reader2 = consumer2.getReader();
  // Produce values first
  produce2("test");
  // Start waiting for close
  const closePromise = waitClosed();
  // Read the value
  const readResult = await reader2.read();
  if (readResult.value !== "test" || readResult.done !== false) {
    throw new Error(
      `MPSC waitClosed test (read) failed: Expected {value: "test", done: false}, got ${JSON.stringify(
        readResult,
      )}`,
    );
  }
  // Close and wait
  close2();
  await closePromise; // Should resolve when closed
  const afterClose = await reader2.read();
  if (afterClose.done !== true) {
    throw new Error(
      `MPSC waitClose test failed: Expected {done: true}, got ${JSON.stringify(
        afterClose,
      )}`,
    );
  }
  // Test case 4: Multiple producers scenario
  const {
    consumer: multiConsumer,
    produce: multiProduce,
    close: multiClose,
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
  multiClose();
  const multiAfterClose = await multiReader.read();
  if (multiAfterClose.done !== true) {
    throw new Error(
      `Multiple producers close test failed: Expected {done: true}, got ${JSON.stringify(multiAfterClose)}`,
    );
  }
  // Test case 5: Reading before producing
  const {
    consumer: delayConsumer,
    produce: delayProduce,
    close: delayClose,
  } = MPSCUtil.create<number>();
  const delayReader = delayConsumer.getReader();
  // Start reading before producing
  const readPromise = delayReader.read();
  // Produce after a small delay
  setTimeout(() => {
    delayProduce(42);
  }, 10);
  const delayResult = await readPromise;
  if (delayResult.value !== 42 || delayResult.done !== false) {
    throw new Error(
      `Delayed production test failed: Expected {value: 42, done: false}, got ${JSON.stringify(delayResult)}`,
    );
  }
  delayClose();
  // Test case 6: Producer-first, then consumer
  const {
    consumer: laterConsumer,
    produce: laterProduce,
    close: laterClose,
  } = MPSCUtil.create<string>();
  // Produce values first
  laterProduce("first");
  laterProduce("second");
  laterProduce("third");
  // Then get reader and read
  const laterReader = laterConsumer.getReader();
  const laterResult1 = await laterReader.read();
  const laterResult2 = await laterReader.read();
  const laterResult3 = await laterReader.read();
  if (laterResult1.value !== "first" || laterResult1.done !== false) {
    throw new Error(
      `Producer-first test failed: Expected {value: "first", done: false}, got ${JSON.stringify(laterResult1)}`,
    );
  }
  if (laterResult2.value !== "second" || laterResult2.done !== false) {
    throw new Error(
      `Producer-first test failed: Expected {value: "second", done: false}, got ${JSON.stringify(laterResult2)}`,
    );
  }
  if (laterResult3.value !== "third" || laterResult3.done !== false) {
    throw new Error(
      `Producer-first test failed: Expected {value: "third", done: false}, got ${JSON.stringify(
        laterResult3,
      )}`,
    );
  }
  laterClose();
}
