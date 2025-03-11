export namespace MPSCUtil {
  export interface Output<T> {
    consumer: ReadableStream<T>;
    produce: (chunk: T) => void;
    close: () => void;
    /**
     * Wait until the producing is finished.
     */
    waitClosed: () => Promise<void>;
    /**
     * Wait until the consuming is finished.(finished producing and consuming)
     */
    waitUntilEmpty: () => Promise<void>;

    /**
     * Check if producing is done and consuming is finished.
     */
    done: () => boolean;
  }

  export const create = <T>(): Output<T> => {
    const queue = new AsyncQueue<T>();
    const consumer = new ReadableStream<T>({
      async pull(controller) {
        const { value, done } = await queue.dequeue();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
    });

    return {
      consumer,
      produce: (chunk: T) => queue.enqueue(chunk),
      close: () => queue.close(),
      done: () => queue.done(),
      waitClosed: () => queue.waitClosed(),
      waitUntilEmpty: () => queue.waitUntilEmpty(),
    };
  };

  export class AsyncQueue<T> {
    private queue: T[] = [];
    private resolvers: ((value: IteratorResult<T, undefined>) => void)[] = [];
    private closeResolvers: (() => void)[] = [];
    private emptyResolvers: (() => void)[] = [];
    private closed = false;

    enqueue(item: T) {
      this.queue.push(item);
      if (this.resolvers.length > 0) {
        this.resolvers.shift()?.({ value: this.queue.shift()!, done: false });
      }
    }

    async dequeue(): Promise<IteratorResult<T, undefined>> {
      if (this.queue.length > 0) {
        return { value: this.queue.shift()!, done: false };
      }
      if (this.closed) {
        if (this.emptyResolvers.length > 0) {
          this.emptyResolvers.forEach((resolve) => resolve());
          this.emptyResolvers = [];
        }
        return { value: undefined, done: true };
      }
      return new Promise((resolve) => this.resolvers.push(resolve));
    }

    isEmpty() {
      return this.queue.length === 0;
    }

    isClosed() {
      return this.closed;
    }

    done() {
      return this.isClosed() && this.isEmpty();
    }

    close() {
      this.closed = true;
      while (this.resolvers.length > 0) {
        this.resolvers.shift()?.({ value: undefined, done: true });
      }
      this.closeResolvers.forEach((resolve) => resolve());
    }

    waitUntilEmpty() {
      if (this.isEmpty()) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve) => {
        this.emptyResolvers.push(resolve);
      });
    }

    waitClosed() {
      if (this.isClosed()) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        this.closeResolvers.push(resolve);
      });
    }
  }
}
