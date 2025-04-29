import type {
  AgenticaHistory,
  AgenticaRequestEvent,
  AgenticaResponseEvent,
} from "@agentica/core";

import {
  Agentica,
} from "@agentica/core";
import OpenAI from "openai";

import { TestGlobal } from "../TestGlobal";

export async function test_base_streaming(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  // Create a new Agentica instance
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
      }),
    },
    controllers: [],
  });

  // Variables to track events
  let requestEventFired = false;
  let responseEventFired = false;
  const streamContentPieces: string[] = [];
  let textEventReceived = false;

  // Add event listeners to track streaming events
  agent.on("request", (event: AgenticaRequestEvent) => {
    requestEventFired = true;
    // Verify request is configured for streaming
    if (event.body.stream !== true) {
      throw new Error("Streaming not enabled in request");
    }
  });

  agent.on("response", async (event: AgenticaResponseEvent) => {
    responseEventFired = true;
    // Test the stream
    for await (const value of event.stream) {
      if (value.choices !== undefined && value.choices[0]?.delta?.content !== undefined) {
        streamContentPieces.push(value.choices[0].delta.content as string);
      }
    }
    // Verify we got some content in the stream
    if (streamContentPieces.length === 0) {
      throw new Error("No content received in stream");
    }
  });

  agent.on("text", () => {
    textEventReceived = true;
    // This event is fired when text content is received
  });

  // Execute the conversation
  const result: AgenticaHistory<"chatgpt">[] = await agent.conversate(
    "Explain what streaming is in 3 short sentences.",
  );

  // Verify the events were fired
  if (!requestEventFired) {
    throw new Error("Request event was not fired");
  }

  if (!responseEventFired) {
    throw new Error("Response event was not fired");
  }

  if (!textEventReceived) {
    throw new Error("Text event was not received");
  }

  // Verify the response contains a text from the AI
  const aiResponse = result.find(
    prompt => prompt.type === "text" && prompt.role === "assistant",
  );

  if (aiResponse === undefined || aiResponse.type !== "text") {
    throw new Error("No assistant text response found");
  }

  // Verify the response contains actual content
  if (aiResponse.text === undefined || aiResponse.text.length < 10) {
    throw new Error("Assistant response is too short or empty");
  }

  // Verify that the content we got in stream matches what's in the final response
  // We don't check for exact equality because there might be minor processing differences
  const combinedStreamContent = streamContentPieces.join("");
  if (
    combinedStreamContent.length === 0
    || !aiResponse.text.includes(combinedStreamContent.substring(0, 10))
  ) {
    throw new Error("Stream content doesn't match final response content");
  }
}
