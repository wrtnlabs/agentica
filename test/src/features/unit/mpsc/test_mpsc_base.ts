import { MPSC } from "@agentica/core/src/internal/MPSC";

export async function test_mpsc_base(): Promise<void | false> {
  // Test case 1: Basic MPSC functionality with create
  const mpsc = new MPSC<number>();
  const reader = mpsc.consumer.getReader();
  // Produce values
  mpsc.produce(10);
  mpsc.produce(20);
  mpsc.produce(30);
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
  const mpsc2 = new MPSC<string>();
  const reader2 = mpsc2.consumer.getReader();
  // Produce values first
  mpsc2.produce("test");
  // Start waiting for close
  const closePromise = mpsc2.waitClosed();
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
  mpsc2.close();
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
  const multiMpsc = new MPSC<string>();
  const multiReader = multiMpsc.consumer.getReader();
  // Simulate multiple producers
  for (let i = 1; i <= 5; i++) {
    multiMpsc.produce(`producer-${i}`);
  }
  // Read all values
  const multiResults: string[] = [];
  for (let i = 0; i < 5; i++) {
    const { value } = await multiReader.read();
    if (value != null) {
      multiResults.push(value);
    }
  }
  if (
    multiResults.length !== 5
    || !multiResults.includes("producer-1")
    || !multiResults.includes("producer-2")
    || !multiResults.includes("producer-3")
    || !multiResults.includes("producer-4")
    || !multiResults.includes("producer-5")
  ) {
    throw new Error(
      `Multiple producers test failed: Expected 5 values from producers, got ${JSON.stringify(multiResults)}`,
    );
  }
  multiMpsc.close();

  const multiAfterClose = await multiReader.read();
  if (multiAfterClose.done !== true) {
    throw new Error(
      `Multiple producers close test failed: Expected {done: true}, got ${JSON.stringify(multiAfterClose)}`,
    );
  }
  // Test case 5: Reading before producing
  const delayMpsc = new MPSC<number>();
  const delayReader = delayMpsc.consumer.getReader();
  // Start reading before producing
  const readPromise = delayReader.read();
  // Produce after a small delay
  setTimeout(() => {
    delayMpsc.produce(42);
  }, 10);
  const delayResult = await readPromise;
  if (delayResult.value !== 42 || delayResult.done !== false) {
    throw new Error(
      `Delayed production test failed: Expected {value: 42, done: false}, got ${JSON.stringify(delayResult)}`,
    );
  }
  delayMpsc.close();
  // Test case 6: Producer-first, then consumer
  const laterMpsc = new MPSC<string>();
  // Produce values first
  laterMpsc.produce("first");
  laterMpsc.produce("second");
  laterMpsc.produce("third");
  // Then get reader and read
  const laterReader = laterMpsc.consumer.getReader();
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
  laterMpsc.close();
}
