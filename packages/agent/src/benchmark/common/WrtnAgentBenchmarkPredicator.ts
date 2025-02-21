import { ILlmFunction } from "@samchon/openapi";
import OpenAI from "openai";
import typia from "typia";

import { WrtnAgent } from "../../WrtnAgent";
import { IWrtnAgentOperation } from "../../module";
import { IWrtnAgentPrompt } from "../../structures/IWrtnAgentPrompt";
import { IWrtnAgentBenchmarkExpected } from "./IWrtnAgentBenchmarkExpected";

export namespace WrtnAgentBenchmarkPredicator {
  export const isNext = async (agent: WrtnAgent): Promise<string | null> => {
    const last: IWrtnAgentPrompt | undefined = agent
      .getPromptHistories()
      .at(-1);
    if (last?.type !== "text" || last.role !== "assistant") return null;

    const consent: ILlmFunction<"chatgpt"> = typia.llm.application<
      IPredicatorApplication,
      "chatgpt"
    >().functions[0]!;
    const result: OpenAI.ChatCompletion = await agent[
      "props"
    ].provider.api.chat.completions.create(
      {
        model: agent["props"].provider.model,
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
      agent["props"].provider.options,
    );
    const toolCall: OpenAI.ChatCompletionMessageToolCall | undefined = (
      result.choices[0]?.message.tool_calls ?? []
    ).filter(
      (tc) => tc.type === "function" && tc.function.name === consent.name,
    )?.[0];
    if (toolCall === undefined) return null;
    const input: IConsentProps = JSON.parse(toolCall.function.arguments);
    return typia.is(input) ? input.reply : null;
  };

  /**
   * Check if the called operations match the expected operations.
   *
   * @param props Properties for checking the match of the called operations
   * and the expected operations
   *
   * @returns `true` if the called operations match the expected operations,
   * otherwise `false`.
   */
  export const success = (props: {
    /**
     * Expected operations to be called.
     */
    expected: IWrtnAgentBenchmarkExpected;

    /**
     * Called operations.
     */
    called: Array<IWrtnAgentOperation | IWrtnAgentPrompt.IExecute>;

    /**
     * If `true`, the function will return `false` even if the expected operation
     * is not found in the called operations.
     *
     * @default `false`
     */
    strict?: boolean;
  }): boolean => successInner(props).result;

  const successInner = (
    props: Parameters<typeof success>[0],
  ):
    | {
        result: true;
        take: number;
      }
    | {
        result: false;
      } => {
    const call = (
      expected: IWrtnAgentBenchmarkExpected,
      overrideOperations?: Array<
        IWrtnAgentOperation | IWrtnAgentPrompt.IExecute
      >,
    ) =>
      successInner({
        expected,
        called: overrideOperations ?? props.called,
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
          if (take >= props.called.length) {
            return { result: false };
          }

          const result = call(targeted.value, props.called.slice(take));
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
        const result = props.called.some((op) => op.name === target.name);
        return {
          result,
          take: result ? 1 : -1,
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
        const result = props.expected.allOf.map((expected) => call(expected));
        if (result.every((r) => r.result)) {
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
  };
}

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
  consent(props: IConsentProps): void;
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
