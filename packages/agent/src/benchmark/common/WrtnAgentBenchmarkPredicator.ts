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

  export const success = (props: {
    agent: WrtnAgent;
    expected: IWrtnAgentBenchmarkExpected;
    operations: Array<IWrtnAgentOperation | IWrtnAgentPrompt.IExecute>;
    strict: boolean;
  }): boolean => {
    const call = (
      expected: IWrtnAgentBenchmarkExpected,
      overrideOperations?: Array<
        IWrtnAgentOperation | IWrtnAgentPrompt.IExecute
      >,
    ) =>
      success({
        agent: props.agent,
        expected,
        operations: overrideOperations ?? props.operations,
        strict: props.strict,
      });

    switch (props.expected.type) {
      case "standalone": {
        const standalone = props.expected;
        return props.operations.some(
          (op) => op.name === standalone.operation.name,
        );
      }
      case "allOf":
        return props.expected.allOf.every((expected) => call(expected));
      case "anyOf":
        return props.expected.anyOf.some((expected) => call(expected));
      case "array":
        const targetIterator = props.expected.items[Symbol.iterator]();
        let targeted = targetIterator.next();

        for (const history of props.operations) {
          if (targeted.done) {
            return true;
          }

          if (call(targeted.value, [history])) {
            targeted = targetIterator.next();
            continue;
          }

          if (props.strict) {
            return false;
          }
        }
        return !!targeted.done;
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
