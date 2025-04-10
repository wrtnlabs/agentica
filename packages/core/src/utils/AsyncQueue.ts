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
    const item = (() => {
      if (this.queue.length > 0) {
        return { value: this.queue.shift()!, done: false } as const;
      }
      if (this.closed) {
        return { value: undefined, done: true } as const;
      }
      return undefined;
    })();

    if (this.emptyResolvers.length > 0) {
      this.emptyResolvers.forEach(resolve => resolve());
      this.emptyResolvers = [];
    }

    if (item !== undefined) {
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
