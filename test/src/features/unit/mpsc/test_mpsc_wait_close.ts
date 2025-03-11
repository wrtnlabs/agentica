import { MPSCUtil } from "@agentica/core/src/internal/MPSCUtil";

export async function test_mpsc_wait_close(): Promise<void | false> {
  // Test 1: Basic waitClose functionality
  const { consumer, produce, close, waitClosed } = MPSCUtil.create<string>();
  const reader = consumer.getReader();

  produce("message");
  const readResult = await reader.read();

  if (readResult.value !== "message" || readResult.done !== false) {
    throw new Error(
      `Basic waitClose test failed: Expected {value: "message", done: false}, received ${JSON.stringify(
        readResult,
      )}`,
    );
  }

  // Call waitClose then execute close
  const closePromise = waitClosed();
  close();
  await closePromise; // Should resolve when closed

  const afterClose = await reader.read();
  if (afterClose.done !== true) {
    throw new Error(
      `waitClosed completion test failed: Expected {done: true}, received ${JSON.stringify(
        afterClose,
      )}`,
    );
  }

  // Test 2: Call waitClose on already closed queue
  const { close: close2, waitClosed: waitClosed2 } = MPSCUtil.create<number>();

  close2(); // Close first
  const alreadyClosedPromise = waitClosed2();
  // Should resolve immediately since already closed
  await alreadyClosedPromise;

  // Test 3: Multiple waitClose calls
  const { close: close3, waitClosed: waitClosed3 } = MPSCUtil.create<number>();

  // Create multiple waitClose promises
  const waitPromises = [waitClosed3(), waitClosed3(), waitClosed3()];

  // All promises should resolve
  close3();
  await Promise.all(waitPromises);

  // Test 4: Verify waitClose doesn't block other operations
  const {
    consumer: consumer4,
    produce: produce4,
    close: close4,
    waitClosed: waitClosed4,
  } = MPSCUtil.create<string>();
  const reader4 = consumer4.getReader();

  // Call waitClose
  const waitPromise4 = waitClosed4();

  // Check if value production and consumption still work
  produce4("first");
  produce4("second");

  const read1 = await reader4.read();
  const read2 = await reader4.read();

  if (read1.value !== "first" || read1.done !== false) {
    throw new Error(
      `waitClose blocking test failed: Expected {value: "first", done: false}, received ${JSON.stringify(
        read1,
      )}`,
    );
  }

  if (read2.value !== "second" || read2.done !== false) {
    throw new Error(
      `waitClose blocking test failed: Expected {value: "second", done: false}, received ${JSON.stringify(
        read2,
      )}`,
    );
  }

  close4();
  await waitPromise4;

  const afterClose4 = await reader4.read();
  if (afterClose4.done !== true) {
    throw new Error(
      `waitClosed blocking completion test failed: Expected {done: true}, received ${JSON.stringify(
        afterClose4,
      )}`,
    );
  }

  // Test 5: waitClose resolution after async close
  const {
    consumer: consumer5,
    produce: produce5,
    close: close5,
    waitClosed: waitClosed5,
  } = MPSCUtil.create<number>();
  const reader5 = consumer5.getReader();

  produce5(100);

  // Call waitClose
  const waitPromise5 = waitClosed5();

  // Perform async close
  setTimeout(() => {
    close5();
  }, 50);

  // Wait for waitClose to resolve
  await waitPromise5;
  await reader5.read();

  const afterClose5 = await reader5.read();
  if (afterClose5.done !== true) {
    throw new Error(
      `Async close test failed: Expected {done: true}, received ${JSON.stringify(
        afterClose5,
      )}`,
    );
  }
}
