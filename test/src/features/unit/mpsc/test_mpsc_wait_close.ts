import { MPSC } from "@agentica/core/src/utils/MPSC";

export async function test_mpsc_wait_close(): Promise<void | false> {
  // Test 1: Basic waitClose functionality
  const mpsc = new MPSC<string>();
  const reader = mpsc.consumer.getReader();

  mpsc.produce("message");
  const readResult = await reader.read();

  if (readResult.value !== "message" || readResult.done !== false) {
    throw new Error(
      `Basic waitClose test failed: Expected {value: "message", done: false}, received ${JSON.stringify(
        readResult,
      )}`,
    );
  }

  // Call waitClose then execute close
  const closePromise = mpsc.waitClosed();
  mpsc.close();
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
  const mpsc2 = new MPSC<number>();

  mpsc2.close(); // Close first
  const alreadyClosedPromise = mpsc2.waitClosed();
  // Should resolve immediately since already closed
  await alreadyClosedPromise;

  // Test 3: Multiple waitClose calls
  const mpsc3 = new MPSC<number>();

  // Create multiple waitClose promises
  const waitPromises = [mpsc3.waitClosed(), mpsc3.waitClosed(), mpsc3.waitClosed()];

  // All promises should resolve
  mpsc3.close();
  await Promise.all(waitPromises);

  // Test 4: Verify waitClose doesn't block other operations
  const mpsc4 = new MPSC<string>();
  const reader4 = mpsc4.consumer.getReader();

  // Call waitClose
  const waitPromise4 = mpsc4.waitClosed();

  // Check if value production and consumption still work
  mpsc4.produce("first");
  mpsc4.produce("second");

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

  mpsc4.close();
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
  const mpsc5 = new MPSC<number>();
  const reader5 = mpsc5.consumer.getReader();

  mpsc5.produce(100);

  // Call waitClose
  const waitPromise5 = mpsc5.waitClosed();

  // Perform async close
  setTimeout(() => {
    mpsc5.close();
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
