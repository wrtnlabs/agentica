import { AsyncQueue } from "./AsyncQueue";

export class MPSC<T> {
  private readonly queue: AsyncQueue<T>;
  public readonly consumer: ReadableStream<T>;

  public constructor() {
    this.queue = new AsyncQueue<T>();
    this.consumer = new ReadableStream<T>({
      start: async (controller) => {
        while (true) {
          const { value, done } = await this.queue.dequeue();
          if (done === true) {
            controller.close();
            return;
          }
          controller.enqueue(value);
        }
      },
    });
  }

  produce(chunk: T) {
    this.queue.enqueue(chunk);
  }

  close() {
    this.queue.close();
  }

  done() {
    return this.queue.done();
  }

  async waitClosed() {
    await this.queue.waitClosed();
  }

  async waitUntilEmpty() {
    await this.queue.waitUntilEmpty();
  }
}
