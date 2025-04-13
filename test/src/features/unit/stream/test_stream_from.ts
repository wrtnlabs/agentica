import { utils } from "@agentica/core";

export async function test_stream_from(): Promise<void | false> {
  const stream = utils.StreamUtil.from("Hello, world!");
  const reader = stream.getReader();
  const { done, value } = await reader.read();

  if (done !== false) {
    throw new Error("Stream should not be done on first read");
  }

  if (value !== "Hello, world!") {
    throw new Error(`Expected "Hello, world!" but got "${value}"`);
  }

  const next = await reader.read();
  if (!next.done) {
    throw new Error("Stream should be done after first read");
  }
}
