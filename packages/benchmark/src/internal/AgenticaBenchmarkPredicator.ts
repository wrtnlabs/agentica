/**
 * @module
 * This file contains functions to work with AgenticaBenchmarkPredicator.
 *
 * @author Wrtn Technologies
 */

import type { Agentica, AgenticaOperation, AgenticaPrompt } from "@agentica/core";
import type { ILlmFunction, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";
import type { IAgenticaBenchmarkExpected } from "../structures/IAgenticaBenchmarkExpected";

import typia from "typia";

export const AgenticaBenchmarkPredicator = {
  isNext,
  success,
};

interface IPredicatorApplication {
  /**
   * Ask user to consent for what the AI agent wants to do next.
   *
   * If AI agent wants to do some function calling at next,
   * but it needs the user's consent about the function calling to do,
   * then call this tool function.
   *
   * @param props Properties for asking the user's consent
   */
  consent: (props: IConsentProps) => void;
}

/**
 * Properties for asking the user's consent
 */
interface IConsentProps {
  /**
   * Reason of the message implying what the AI agent wants
   * to do at the next step after the user's consent.
   */
  content: string;

  /**
   * Recommended reply message for the user.
   *
   * The message what AI agent wants the user to reply
   * accepting the AI agent's next job suggestion.
   */
  reply: string;
}

async function isNext<Model extends ILlmSchema.Model>(agent: Agentica<Model>): Promise<string | null> {
  const last: AgenticaPrompt<Model> | undefined = agent
    .getPromptHistories()
    .at(-1);

  const isTextPrompt = last?.type === "text" && last.role === "assistant";
  if (!isTextPrompt) {
    return null;
  }

  const consent: ILlmFunction<"chatgpt"> = typia.llm.application<
    IPredicatorApplication,
    "chatgpt"
  >().functions[0]!;
  const result: OpenAI.ChatCompletion = await agent.props.vendor.api.chat.completions.create(
    {
      model: agent.props.vendor.model,
      messages: [
        {
          role: "system",
          content: [
            "You are an helpful assistant.",
            "",
            "If what the assistant said seems like to asking for",
            "user's consent about some function calling at the next step,",
            "use the tools appropriately to step to the next.",
          ].join("\n"),
        },
        {
          role: "assistant",
          content: last.text,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: consent.name,
            description: consent.description,
            parameters: consent.parameters as Record<string, any>,
          },
        },
      ],
      tool_choice: "required",
      parallel_tool_calls: false,
    },
    agent.props.vendor.options,
  );

  const toolCall: OpenAI.ChatCompletionMessageToolCall | undefined = (
    result.choices[0]?.message.tool_calls ?? []
  ).filter(
    tc => tc.type === "function" && tc.function.name === consent.name,
  )?.[0];

  if (toolCall === undefined) {
    return null;
  }

  const input: IConsentProps = JSON.parse(toolCall.function.arguments);
  return typia.is(input) ? input.reply : null;
}

/**
 * Check if the called operations match the expected operations.
 *
 * @param props Properties for checking the match of the called operations
 * and the expected operations
 *
 * @returns `true` if the called operations match the expected operations,
 * otherwise `false`.
 */
export function success<Model extends ILlmSchema.Model>(props: {
  /**
   * Expected operations to be called.
   *
   * For 'allOf' within an 'array', the next expected element starts checking from the element that follows the last called element in 'allOf'.
   */
  expected: IAgenticaBenchmarkExpected<Model>;

  /**
   * Specified operations.
   */
  operations: Array<AgenticaOperation<Model>>;

  /**
   * If it's `false`, check the array and let it go even if there's something wrong between them.
   *
   * @default `false`
   */
  strict?: boolean;
}): boolean {
  return successInner(props).result;
}

function successInner<Model extends ILlmSchema.Model>(props: Parameters<typeof success<Model>>[0]):
  | {
    result: true;
    take: number;
  }
  | {
    result: false;
  } {
  const call = (
    expected: IAgenticaBenchmarkExpected<Model>,
    overrideOperations?: Array<AgenticaOperation<Model>>,
  ) =>
    successInner({
      expected,
      operations: overrideOperations ?? props.operations,
      strict: props.strict,
    });

  switch (props.expected.type) {
    case "array": {
      let take = 0;
      const targetIterator = props.expected.items[Symbol.iterator]();
      let targeted = targetIterator.next();

      while (true) {
        if (targeted.done) {
          return {
            result: true,
            take,
          };
        }
        if (take >= props.operations.length) {
          return { result: false };
        }

        const result = call(targeted.value, props.operations.slice(take));
        if (!result.result) {
          if (!props.strict) {
            take += 1;
            continue;
          }
          return { result: false };
        }

        take += result.take;
        targeted = targetIterator.next();
      }
    }
    case "standalone": {
      const target = props.expected.operation;
      const result = props.operations.some(op => op.name === target.name);
      if (result) {
        return { result, take: 1 };
      }
      return {
        result,
      };
    }
    case "anyOf":
      for (const expected of props.expected.anyOf) {
        const callResult = call(expected);
        if (callResult.result) {
          return callResult;
        }
      }

      return { result: false };
    case "allOf": {
      /**
       * @example
       * expected = [4, 2];
       * called = [1, 2, 3, 4, 5];
       *
       * { result: true, take: 3 };
       */
      const result = props.expected.allOf.map(expected => call(expected));
      if (result.every(r => r.result)) {
        return {
          result: true,
          take: result.reduce((acc, r) => Math.max(acc, r.take), 0),
        };
      }

      return {
        result: false,
      };
    }
  }
}
