import { AsyncQueue } from "./AsyncQueue";

describe("the AsyncQueue", () => {
  describe("basic functionality", () => {
    it("enqueue and dequeue test", async () => {
      const queue = new AsyncQueue<number>();

      // Enqueue items
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      // Dequeue items
      const result1 = await queue.dequeue();
      const result2 = await queue.dequeue();
      const result3 = await queue.dequeue();

      expect(result1.value).toBe(1);
      expect(result1.done).toBe(false);
      expect(result2.value).toBe(2);
      expect(result2.done).toBe(false);
      expect(result3.value).toBe(3);
      expect(result3.done).toBe(false);
    });

    it("isEmpty test", async () => {
      const queue = new AsyncQueue<number>();

      expect(queue.isEmpty()).toBe(true);

      queue.enqueue(1);
      expect(queue.isEmpty()).toBe(false);

      await queue.dequeue();
      expect(queue.isEmpty()).toBe(true);
    });

    it("isClosed test", () => {
      const queue = new AsyncQueue<number>();

      expect(queue.isClosed()).toBe(false);

      queue.close();
      expect(queue.isClosed()).toBe(true);
    });

    it("done test", async () => {
      const queue = new AsyncQueue<number>();

      expect(queue.done()).toBe(false);

      queue.enqueue(1);
      expect(queue.done()).toBe(false);

      await queue.dequeue();
      expect(queue.done()).toBe(false);

      queue.close();
      expect(queue.done()).toBe(true);
    });
  });

  describe("close functionality", () => {
    it("close test with empty queue", async () => {
      const queue = new AsyncQueue<number>();

      queue.close();

      const result = await queue.dequeue();
      expect(result.done).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it("close test with non-empty queue", async () => {
      const queue = new AsyncQueue<number>();

      queue.enqueue(1);
      queue.enqueue(2);
      queue.close();

      const result1 = await queue.dequeue();
      const result2 = await queue.dequeue();
      const result3 = await queue.dequeue();

      expect(result1.value).toBe(1);
      expect(result1.done).toBe(false);
      expect(result2.value).toBe(2);
      expect(result2.done).toBe(false);
      expect(result3.done).toBe(true);
      expect(result3.value).toBeUndefined();
    });

    it("close test with waiting dequeue", async () => {
      const queue = new AsyncQueue<number>();

      // Start dequeue before enqueue
      const dequeuePromise = queue.dequeue();

      // Close the queue
      queue.close();

      const result = await dequeuePromise;
      expect(result.done).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe("waitUntilEmpty functionality", () => {
    it("waitUntilEmpty test with empty queue", async () => {
      const queue = new AsyncQueue<number>();

      // Should resolve immediately since queue is empty
      await queue.waitUntilEmpty();

      queue.enqueue(1);
      const result = await queue.dequeue();
      expect(result.value).toBe(1);
      expect(result.done).toBe(false);
    });

    it("waitUntilEmpty test with non-empty queue", async () => {
      const queue = new AsyncQueue<number>();

      queue.enqueue(1);
      queue.enqueue(2);

      // waitUntilEmpty should not resolve since queue is not empty
      const waitPromise = queue.waitUntilEmpty();

      // Dequeue first value
      const result1 = await queue.dequeue();
      expect(result1.value).toBe(1);

      // Dequeue second value
      const result2 = await queue.dequeue();
      expect(result2.value).toBe(2);

      // Now queue is empty, waitUntilEmpty should resolve\
      await waitPromise;
    });
  });

  describe("waitClosed functionality", () => {
    it("waitClosed test with unclosed queue", async () => {
      const queue = new AsyncQueue<number>();

      // waitClosed should not resolve since queue is not closed
      const waitPromise = queue.waitClosed();

      queue.enqueue(1);
      const result = await queue.dequeue();
      expect(result.value).toBe(1);

      // Close the queue
      queue.close();

      // Now queue is closed, waitClosed should resolve
      await waitPromise;
    });

    it("waitClosed test with already closed queue", async () => {
      const queue = new AsyncQueue<number>();

      queue.close();

      // waitClosed should resolve immediately since queue is already closed
      await queue.waitClosed();
    });

    it("multiple waitClosed calls test", async () => {
      const queue = new AsyncQueue<number>();

      // Create multiple waitClosed promises
      const waitPromises = [queue.waitClosed(), queue.waitClosed(), queue.waitClosed()];

      // Close the queue
      queue.close();

      // All promises should resolve
      await Promise.all(waitPromises);
    });

    it("waitClosed test with delayed close", async () => {
      const queue = new AsyncQueue<string>();

      // Start waiting for close
      const closePromise = queue.waitClosed();

      // Close after delay
      setTimeout(() => {
        queue.close();
      }, 10);

      await closePromise; // Should resolve when queue is closed
    });
  });

  describe("dequeue behavior", () => {
    it("dequeue before enqueue test", async () => {
      const queue = new AsyncQueue<number>();

      // Start dequeue before enqueue
      const dequeuePromise = queue.dequeue();

      // Enqueue after a small delay
      setTimeout(() => {
        queue.enqueue(42);
      }, 10);

      const result = await dequeuePromise;
      expect(result.value).toBe(42);
      expect(result.done).toBe(false);
    });

    it("multiple dequeue calls test", async () => {
      const queue = new AsyncQueue<number>();

      // Start multiple dequeue calls
      const dequeuePromises = [
        queue.dequeue(),
        queue.dequeue(),
        queue.dequeue(),
      ];

      // Enqueue values
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      const results = await Promise.all(dequeuePromises);

      expect(results[0]?.value).toBe(1);
      expect(results[0]?.done).toBe(false);
      expect(results[1]?.value).toBe(2);
      expect(results[1]?.done).toBe(false);
      expect(results[2]?.value).toBe(3);
      expect(results[2]?.done).toBe(false);
    });

    it("dequeue after close test", async () => {
      const queue = new AsyncQueue<number>();

      queue.enqueue(1);
      queue.close();

      const result1 = await queue.dequeue();
      expect(result1.value).toBe(1);
      expect(result1.done).toBe(false);

      const result2 = await queue.dequeue();
      expect(result2.done).toBe(true);
      expect(result2.value).toBeUndefined();
    });

    it("duplicate dequeue test", async () => {
      const queue = new AsyncQueue<string>();

      // Start dequeue operation that will wait for an item
      const pendingDequeue = queue.dequeue();

      // Add item after a small delay
      setTimeout(() => {
        queue.enqueue("delayed item");
      }, 10);

      const delayedResult = await pendingDequeue;
      expect(delayedResult.value).toBe("delayed item");
      expect(delayedResult.done).toBe(false);

      // Check for duplicate dequeue
      const duplicatedResult = await Promise.race([
        queue.dequeue(),
        new Promise(resolve => setTimeout(resolve, 0, false)),
      ]) as false | IteratorResult<string, undefined>;

      // If duplicatedResult is false, it means the race timed out (expected)
      // If it's an IteratorResult, it should not have the same value
      if (duplicatedResult !== false) {
        expect(duplicatedResult.value).not.toBe("delayed item");
      }
    });
  });

  describe("edge cases and error handling", () => {
    it("enqueue after close test", async () => {
      const queue = new AsyncQueue<number>();

      queue.close();
      queue.enqueue(1); // Should still work, but dequeue will return done: true

      const result = await queue.dequeue();
      expect(result.done).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it("multiple close calls test", async () => {
      const queue = new AsyncQueue<number>();

      queue.close();
      queue.close(); // Second close should not cause issues

      const result = await queue.dequeue();
      expect(result.done).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it("waitUntilEmpty with multiple calls test", async () => {
      const queue = new AsyncQueue<number>();

      queue.enqueue(1);

      // Create multiple waitUntilEmpty promises
      const waitPromises = [queue.waitUntilEmpty(), queue.waitUntilEmpty()];

      // Dequeue the value
      await queue.dequeue();

      // All promises should resolve
      await Promise.all(waitPromises);
    });

    it("concurrent enqueue and dequeue test", async () => {
      const queue = new AsyncQueue<number>();
      const results: number[] = [];

      // Start multiple dequeue operations
      const dequeuePromises = Array.from({ length: 5 }).fill(0).map(async () => queue.dequeue());

      // Enqueue values with small delays
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          queue.enqueue(i);
        }, i * 10);
      }

      // Wait for all dequeue operations to complete
      const dequeuedResults = await Promise.all(dequeuePromises);

      // Collect values
      dequeuedResults.forEach((result) => {
        if (result.value !== undefined) {
          results.push(result.value);
        }
      });

      // Check that all values were dequeued
      expect(results.length).toBe(5);
      expect(results).toContain(0);
      expect(results).toContain(1);
      expect(results).toContain(2);
      expect(results).toContain(3);
      expect(results).toContain(4);
    });
  });
});
