export namespace MPSCUtil {
  export interface Output<T> {
    consumer: ReadableStream<T>;
    produce: (chunk: T) => void;
    close: () => void;
    waitClose: () => Promise<void>;
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
      waitClose: () => queue.waitClose(),
    };
  };

  export class AsyncQueue<T> {
    private queue: T[] = [];
    private resolvers: ((value: IteratorResult<T, undefined>) => void)[] = [];
    private closeResolvers: (() => void)[] = [];

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
      if (this.closed) return { value: undefined, done: true };
      return new Promise((resolve) => this.resolvers.push(resolve));
    }

    done() {
      return this.closed;
    }

    close() {
      this.closed = true;
      while (this.resolvers.length > 0) {
        this.resolvers.shift()?.({ value: undefined, done: true });
      }
      this.closeResolvers.forEach((resolve) => resolve());
    }

    waitClose() {
      if (this.closed) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve) => {
        this.closeResolvers.push(resolve);
      });
    }
  }
}
