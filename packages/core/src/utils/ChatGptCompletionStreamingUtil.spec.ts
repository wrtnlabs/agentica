import type { ChatCompletionChunk } from "openai/resources";

import { beforeEach, describe, expect, it, vi } from "vitest";

import { reduceStreamingWithDispatch } from "./ChatGptCompletionStreamingUtil";
import { StreamUtil } from "./StreamUtil";

describe("reduceStreamingWithDispatch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("basic functionality", () => {
    it("should process single chunk successfully", async () => {
      const mockChunk: ChatCompletionChunk = {
        id: "test-id",
        object: "chat.completion.chunk",
        created: 1234567890,
        model: "gpt-3.5-turbo",
        choices: [
          {
            index: 0,
            delta: { content: "Hello" },
            finish_reason: null,
          },
        ],
      };

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          controller.enqueue(mockChunk);
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(result.object).toBe("chat.completion");
      expect(eventProcessor).toHaveBeenCalledTimes(1);
    });

    it("should handle multiple chunks with content accumulation", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " World" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "!" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(result.object).toBe("chat.completion");
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello World!");
    });

    it("should handle empty content chunks", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello");
    });
  });

  describe("multiple choices handling", () => {
    it("should handle multiple choices with different indices", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Choice 1" },
              finish_reason: null,
            },
            {
              index: 1,
              delta: { content: "Choice 2" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " continued" },
              finish_reason: "stop",
            },
            {
              index: 1,
              delta: { content: " continued" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(2);

      const firstCall = eventProcessor.mock.calls[0]?.[0];
      const secondCall = eventProcessor.mock.calls[1]?.[0];
      expect(firstCall.get()).toBe("Choice 1 continued");
      expect(secondCall.get()).toBe("Choice 2 continued");
    });
  });

  describe("finish reason handling", () => {
    it("should close context when finish_reason is provided", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " World" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello World");
      expect(eventCall.done()).toBe(true);
    });
  });

  describe("stream processing", () => {
    it("should provide working stream in event processor", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " World" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });
      const streamedContent: string[] = [];
      await new Promise(async (resolve) => {
        const eventProcessor = vi.fn(({ stream: contentStream }) => {
          (async () => {
            for await (const content of contentStream) {
              streamedContent.push(content);
            }
            resolve(true);
          })();
        });

        await reduceStreamingWithDispatch(stream, eventProcessor);
      });
      expect(streamedContent).toEqual(["Hello", " World"]);
    });

    it("should provide working join function", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " World" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      let joinedContent = "";
      const eventProcessor = vi.fn(async ({ join }) => {
        joinedContent = await join();
      });

      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(joinedContent).toBe("Hello World");
    });
  });

  describe("error handling", () => {
    it("should throw error for empty stream", async () => {
      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          controller.close();
        },
      });

      const eventProcessor = vi.fn();

      await expect(reduceStreamingWithDispatch(stream, eventProcessor)).rejects.toThrow(
        "StreamUtil.reduce did not produce a ChatCompletion",
      );
    });

    it("should handle stream with only finish_reason chunks", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: null },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).not.toHaveBeenCalled();
    });
  });

  describe("complex scenarios", () => {
    it("should handle mixed content and finish_reason chunks", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: null },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " World" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: null },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello World");
    });
  });

  describe("edge cases and exceptions", () => {
    it("should handle null delta content", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: null },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello");
    });

    it("should handle missing delta object", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello");
    });

    it("should handle chunks with no choices", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe("Hello");
    });

    it("should handle very large content chunks", async () => {
      const largeContent = "x".repeat(10000);
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: largeContent },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      // Now single chunk with content should trigger eventProcessor
      expect(eventProcessor).toHaveBeenCalledOnce();

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe(largeContent);
    });

    it("should handle rapid consecutive chunks", async () => {
      const chunks: ChatCompletionChunk[] = Array.from({ length: 100 }, (_, i) => ({
        id: "test-id",
        object: "chat.completion.chunk" as const,
        created: 1234567890,
        model: "gpt-3.5-turbo",
        choices: [
          {
            index: 0,
            delta: { content: i.toString() },
            finish_reason: i === 99 ? "stop" as const : null,
          },
        ],
      }));

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(1);

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      const expectedContent = Array.from({ length: 100 }, (_, i) => i.toString()).join("");
      expect(eventCall.get()).toBe(expectedContent);
    });

    it("should handle out-of-order choice indices", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 2,
              delta: { content: "Third" },
              finish_reason: null,
            },
            {
              index: 0,
              delta: { content: "First" },
              finish_reason: null,
            },
            {
              index: 1,
              delta: { content: "Second" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " content" },
              finish_reason: "stop",
            },
            {
              index: 1,
              delta: { content: " content" },
              finish_reason: "stop",
            },
            {
              index: 2,
              delta: { content: " content" },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          chunks.forEach(chunk => controller.enqueue(chunk));
          controller.close();
        },
      });

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(3);

      const calls = eventProcessor.mock.calls.map(call => call[0]);
      expect(calls[0].get()).toBe("Third content");
      expect(calls[1].get()).toBe("First content");
      expect(calls[2].get()).toBe("Second content");
    });

    it("should handle mixed finish reasons", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
            {
              index: 1,
              delta: { content: "World" },
              finish_reason: null,
            },
          ],
        },
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: " there" },
              finish_reason: "stop",
            },
            {
              index: 1,
              delta: { content: "!" },
              finish_reason: "length",
            },
          ],
        },
      ];

      const stream = StreamUtil.from(...chunks);

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      expect(eventProcessor).toHaveBeenCalledTimes(2);

      const firstCall = eventProcessor.mock.calls[0]?.[0];
      const secondCall = eventProcessor.mock.calls[1]?.[0];
      expect(firstCall.get()).toBe("Hello there");
      expect(secondCall.get()).toBe("World!");
      await firstCall.join();
      await secondCall.join();
      expect(firstCall.done()).toBe(true);
      expect(secondCall.done()).toBe(true);
    });

    it("should handle Unicode and special characters", async () => {
      const specialContent = "Hello 🌍! 안녕하세요 مرحبا 🚀 ñáéíóú";
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: specialContent },
              finish_reason: "stop",
            },
          ],
        },
      ];

      const stream = StreamUtil.from(...chunks);

      const eventProcessor = vi.fn();
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);

      expect(result).toBeDefined();
      // Now single chunk with content should trigger eventProcessor
      expect(eventProcessor).toHaveBeenCalledOnce();

      const eventCall = eventProcessor.mock.calls[0]?.[0];
      expect(eventCall.get()).toBe(specialContent);
    });

    it("should handle stream reader errors gracefully", async () => {
      const chunks: ChatCompletionChunk[] = [
        {
          id: "test-id",
          object: "chat.completion.chunk",
          created: 1234567890,
          model: "gpt-3.5-turbo",
          choices: [
            {
              index: 0,
              delta: { content: "Hello" },
              finish_reason: null,
            },
          ],
        },
      ];

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          controller.enqueue(chunks[0]);
          // Simulate an error in the stream
          controller.error(new Error("Stream error"));
        },
      });

      const eventProcessor = vi.fn();

      await expect(reduceStreamingWithDispatch(stream, eventProcessor))
        .rejects
        .toThrow("Stream error");
    });

    it("should handle completely malformed chunks gracefully", async () => {
      const malformedChunk = {
        // Missing required fields
        object: "chat.completion.chunk",
        choices: [
          {
            // Missing index
            delta: { content: "Hello" },
            finish_reason: null,
          },
        ],
      } as any;

      const stream = new ReadableStream<ChatCompletionChunk>({
        start(controller) {
          controller.enqueue(malformedChunk);
          controller.close();
        },
      });

      const eventProcessor = vi.fn();

      // Should not throw, but should handle gracefully
      const result = await reduceStreamingWithDispatch(stream, eventProcessor);
      expect(result).toBeDefined();
    });
  });
});
