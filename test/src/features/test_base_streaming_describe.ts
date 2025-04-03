import type {
  AgenticaEvent,
  AgenticaPrompt,
  IAgenticaController,
} from "@agentica/core";

import {
  Agentica,
} from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { TestGlobal } from "../TestGlobal";

// Create a simple calculator controller
class Calculator {
  /**
   * Add two numbers.
   *
   * @param params Two numbers to add
   * @returns Sum of the two numbers
   */
  public add(params: { a: number; b: number }): number {
    return params.a + params.b;
  }

  /**
   * Subtract the second number from the first number.
   *
   * @param params Two numbers to operate on
   * @returns Result of subtraction
   */
  public subtract(params: { a: number; b: number }): number {
    return params.a - params.b;
  }
}

export async function test_base_streaming_describe(): Promise<void | false> {
  if (TestGlobal.chatgptApiKey.length === 0) {
    return false;
  }

  // Variables for event tracking
  const events: AgenticaEvent<"chatgpt">[] = [];
  let functionCalled = false;
  const streamContentPieces: string[] = [];
  let describeEventReceived = false;
  let describeStreamProcessed = false;
  let describeJoinResult: string | undefined;
  // Create calculator controller
  const calculatorController: IAgenticaController<"chatgpt"> = {
    protocol: "class",
    name: "calculator",
    application: typia.llm.application<Calculator, "chatgpt">(),
    execute: new Calculator(),
  };

  // Create Agentica instance
  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      model: "gpt-4o-mini",
      api: new OpenAI({
        apiKey: TestGlobal.env.CHATGPT_API_KEY,
      }),
    },
    controllers: [calculatorController],
  });

  // Register event listeners - tool call related events
  agent.on("select", (event) => {
    events.push(event);
  });

  agent.on("call", (event) => {
    events.push(event);
    if (event.operation.name === "add" || event.operation.name === "subtract") {
      functionCalled = true;
    }
  });

  agent.on("execute", (event) => {
    events.push(event);
  });

  // Add describe event listener
  agent.on("describe", async (event) => {
    events.push(event);
    describeEventReceived = true;
    // Process describe event stream

    describeStreamProcessed = true;
    describeJoinResult = await event.join();

    const reader = event.stream.getReader();
    while (true) {
      const { done, value } = await reader.read().catch((e) => {
        console.error(e);
        return { done: true, value: undefined };
      });
      if (done) {
        break;
      }

      // Extract text content from stream chunks
      try {
        if (typeof value === "string") {
          // If it's a string, store directly
          streamContentPieces.push(value);
        }
        else {
          console.error(value);
          throw new Error(
            "Error processing describe stream: value is not String, meaning stream is not String stream",
          );
        }
      }
      catch (err) {
        console.error("Error during describe stream processing:", err);
      }
    }

    // Check if content was received from stream
    if (streamContentPieces.length === 0) {
      throw new Error("No content received from describe stream");
    }
  });

  // Set up numbers for testing
  const a = 5123123123;
  const b = 3412342134;

  // Start conversation - induce function call while requesting additional explanation
  const result: AgenticaPrompt<"chatgpt">[] = await agent.conversate(
    `Please add ${a} and ${b}. And briefly explain what addition is. Use calculator.`,
  );

  // Verify describe event occurred
  if (!describeEventReceived) {
    throw new Error("describe event did not occur");
  }

  // Verify describe stream was processed
  if (!describeStreamProcessed) {
    throw new Error("describe event stream was not processed");
  }

  // Verify function was called
  if (!functionCalled) {
    throw new Error("No function was called during conversation");
  }

  // Verify execution result
  const executeEvent = events.find(e => e.type === "execute");
  if (executeEvent === undefined) {
    throw new Error("Could not find execute event");
  }

  if (executeEvent.value !== a + b) {
    throw new Error(
      `Result should be ${a + b}, but received ${executeEvent.value as string}`,
    );
  }

  // Verify AI response
  const aiResponse = result.find(prompt => prompt.type === "describe");

  // Compare stream content with final response content
  const combinedStreamContent = streamContentPieces.join("");
  if (
    combinedStreamContent.length === 0
    || aiResponse?.text !== combinedStreamContent
    || combinedStreamContent !== describeJoinResult
  ) {
    throw new Error(
      "describe stream content, final response content, and join result do not match",
    );
  }

  // Verify describe event content
  const describeEvent = events.find(e => e.type === "describe");
  if (describeEvent === undefined) {
    throw new Error("Could not find describe event");
  }

  // Check if describe event includes executions array
  if (describeEvent.executes === undefined || describeEvent.executes.length === 0) {
    throw new Error("describe event has no executions information");
  }

  // Check if calculator tool call is included

  const hasCalculatorExecution = describeEvent.executes.some(
    exec =>
      exec.operation.name === "add" || exec.operation.name === "subtract",
  );
  if (!hasCalculatorExecution) {
    throw new Error(
      "describe event does not include calculator tool call information",
    );
  }

  // Verify stream and join function exist
  if (describeEvent.stream === undefined || typeof describeEvent.join !== "function") {
    throw new Error("describe event is missing stream or join function");
  }

  // Verify text content through join function
  const describeText = await describeEvent.join();
  if (describeText === undefined || describeText.length < 5) {
    throw new Error("describe event text content is too short or empty");
  }
}
