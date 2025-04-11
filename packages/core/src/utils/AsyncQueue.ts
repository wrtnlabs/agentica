export class AsyncQueueClosedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AsyncQueueClosedError";
  }
}

export class AsyncQueue<T> {
  private queue: T[] = [];
  private resolvers: ((value: IteratorResult<T, undefined>) => void)[] = [];
  private closeResolvers: (() => void)[] = [];
  private emptyResolvers: (() => void)[] = [];
  private closed = false;

  enqueue(item: T) {
    if (this.closed) {
      console.error(new AsyncQueueClosedError("Cannot enqueue item: queue is closed."));
      return;
    }

    this.queue.push(item);
    if (this.resolvers.length > 0) {
      this.resolvers.shift()?.({ value: this.queue.shift()!, done: false });
    }
  }

  async dequeue(): Promise<IteratorResult<T, undefined>> {
    const item = (() => {
      if (!this.isEmpty()) {
        return { value: this.queue.shift()!, done: false } as const;
      }
      if (this.isClosed()) {
        return { value: undefined, done: true } as const;
      }
      return null;
    })();

    if (this.isEmpty() && this.emptyResolvers.length !== 0) {
      this.emptyResolvers.forEach(resolve => resolve());
      this.emptyResolvers = [];
    }

    if (item !== null) {
      return item;
    }

    return new Promise(resolve => this.resolvers.push(resolve));
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
    this.closeResolvers.forEach(resolve => resolve());
  }

  /**
   * Wait until the queue is empty
   *
   * if the queue is closed, it will not resolve promise
   * this function only check the queue is empty
   * @returns A promise that resolves when the queue is empty
   */
  async waitUntilEmpty() {
    if (this.isEmpty()) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      this.emptyResolvers.push(resolve);
    });
  }

  async waitClosed() {
    if (this.isClosed()) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.closeResolvers.push(resolve);
    });
  }
}
