import { MPSC } from "./MPSC";

describe("mPSC", () => {
  describe("basic functionality", () => {
    it("basic MPSC functionality test", async () => {
      const mpsc = new MPSC<number>();
      const reader = mpsc.consumer.getReader();

      // Produce values
      mpsc.produce(10);
      mpsc.produce(20);
      mpsc.produce(30);

      const read1 = await reader.read();
      const read2 = await reader.read();
      const read3 = await reader.read();

      expect(read1.value).toBe(10);
      expect(read1.done).toBe(false);
      expect(read2.value).toBe(20);
      expect(read2.done).toBe(false);
      expect(read3.value).toBe(30);
      expect(read3.done).toBe(false);
    });

    it("close functionality test", async () => {
      const mpsc = new MPSC<number>();
      const reader = mpsc.consumer.getReader();

      mpsc.produce(10);
      mpsc.close();

      await reader.read();

      expect(mpsc.done()).toBe(true);
    });

    it("multiple producers scenario test", async () => {
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

      expect(multiResults.length).toBe(5);
      expect(multiResults).toContain("producer-1");
      expect(multiResults).toContain("producer-2");
      expect(multiResults).toContain("producer-3");
      expect(multiResults).toContain("producer-4");
      expect(multiResults).toContain("producer-5");

      multiMpsc.close();

      const multiAfterClose = await multiReader.read();
      expect(multiAfterClose.done).toBe(true);
    });

    it("reading before producing test", async () => {
      const delayMpsc = new MPSC<number>();
      const delayReader = delayMpsc.consumer.getReader();

      // Start reading before producing
      const readPromise = delayReader.read();

      // Produce after a small delay
      setTimeout(() => {
        delayMpsc.produce(42);
      }, 10);

      const delayResult = await readPromise;
      expect(delayResult.value).toBe(42);
      expect(delayResult.done).toBe(false);

      delayMpsc.close();
    });

    it("producer-first, then consumer test", async () => {
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

      expect(laterResult1.value).toBe("first");
      expect(laterResult1.done).toBe(false);
      expect(laterResult2.value).toBe("second");
      expect(laterResult2.done).toBe(false);
      expect(laterResult3.value).toBe("third");
      expect(laterResult3.done).toBe(false);

      laterMpsc.close();
    });
  });

  describe("waitClosed functionality", () => {
    it("basic waitClosed functionality test", async () => {
      const mpsc = new MPSC<string>();
      const reader = mpsc.consumer.getReader();

      mpsc.produce("message");
      const readResult = await reader.read();

      expect(readResult.value).toBe("message");
      expect(readResult.done).toBe(false);

      // Call waitClose then execute close
      const closePromise = mpsc.waitClosed();
      mpsc.close();
      await closePromise; // Should resolve when closed

      const afterClose = await reader.read();
      expect(afterClose.done).toBe(true);
    });

    it("call waitClose on already closed queue test", async () => {
      const mpsc2 = new MPSC<number>();

      mpsc2.close(); // Close first
      const alreadyClosedPromise = mpsc2.waitClosed();
      // Should resolve immediately since already closed
      await alreadyClosedPromise;
    });

    it("multiple waitClose calls test", async () => {
      const mpsc3 = new MPSC<number>();

      // Create multiple waitClose promises
      const waitPromises = [mpsc3.waitClosed(), mpsc3.waitClosed(), mpsc3.waitClosed()];

      // All promises should resolve
      mpsc3.close();
      await Promise.all(waitPromises);
    });

    it("verify waitClose doesn't block other operations", async () => {
      const mpsc4 = new MPSC<string>();
      const reader4 = mpsc4.consumer.getReader();

      // Call waitClose
      const waitPromise4 = mpsc4.waitClosed();

      // Check if value production and consumption still work
      mpsc4.produce("first");
      mpsc4.produce("second");

      const read1 = await reader4.read();
      const read2 = await reader4.read();

      expect(read1.value).toBe("first");
      expect(read1.done).toBe(false);
      expect(read2.value).toBe("second");
      expect(read2.done).toBe(false);

      mpsc4.close();
      await waitPromise4;

      const afterClose4 = await reader4.read();
      expect(afterClose4.done).toBe(true);
    });

    it("waitClose resolution after async close test", async () => {
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
      expect(afterClose5.done).toBe(true);
    });
  });

  describe("waitUntilEmpty functionality", () => {
    it("waitUntilEmpty test when queue is empty", async () => {
      const mpsc = new MPSC<number>();
      const reader = mpsc.consumer.getReader();

      // Should resolve immediately since queue is empty
      await mpsc.waitUntilEmpty();

      mpsc.produce(1);
      const readResult = await reader.read();
      expect(readResult.value).toBe(1);
      expect(readResult.done).toBe(false);

      mpsc.close();
    });

    it("waitUntilEmpty test when queue is not empty", async () => {
      const mpsc = new MPSC<number>();
      const reader = mpsc.consumer.getReader();

      mpsc.produce(1);
      mpsc.produce(2);

      // waitUntilEmpty should not resolve since queue is not empty
      const waitPromise = mpsc.waitUntilEmpty();

      // Read first value
      const read1 = await reader.read();
      expect(read1.value).toBe(1);

      // Read second value
      const read2 = await reader.read();
      expect(read2.value).toBe(2);

      const read3 = await reader.read();
      expect(read3.done).toBe(true);

      // Now queue is empty, waitUntilEmpty should resolve
      await waitPromise;

      mpsc.close();
    });

    it("waitUntilEmpty test on closed queue", async () => {
      const mpsc = new MPSC<number>();
      const reader = mpsc.consumer.getReader();

      mpsc.produce(1);
      mpsc.close();

      // waitUntilEmpty should resolve since queue is closed
      await mpsc.waitUntilEmpty();

      const readResult = await reader.read();
      expect(readResult.value).toBe(1);
      expect(readResult.done).toBe(false);

      const afterClose = await reader.read();
      expect(afterClose.done).toBe(true);
    });
  });

  describe("done functionality", () => {
    it("done test on unclosed queue", async () => {
      const mpsc = new MPSC<number>();
      expect(mpsc.done()).toBe(false);

      mpsc.produce(1);
      expect(mpsc.done()).toBe(false);

      mpsc.close();
      await mpsc.consumer.getReader().read();
      expect(mpsc.done()).toBe(true);
    });
  });
});
