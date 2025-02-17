import {
  IWrtnAgentContext,
  IWrtnAgentPrompt,
  WrtnAgent,
} from "@wrtnlabs/agent";
import OpenAI from "openai";

import { IWrtnAdditionalAgent } from "../../src/structures/IWrtnAdditionalAgent";

export async function test_base_merge_config() {
  // Create agent with default configuration
  const basicAgent = new WrtnAgent({
    provider: {
      model: "gpt-4",
      api: new OpenAI({
        apiKey: process.env.CHATGPT_API_KEY,
      }),
      type: "chatgpt",
    },
    controllers: [],
  });

  // Check if default configuration is applied correctly
  const basicConfig = basicAgent.getConfig();
  if (!("agentExecutePlan" in basicConfig)) {
    throw new Error("Default agentExecutePlan is missing");
  }

  // Check if all default states from DEFAULT_CHATGPT_AGENT exist
  const defaultStates: IWrtnAdditionalAgent.DefaultAgentName[] = [
    "initialize",
    "select",
    "execute",
    "describe",
    "canceled",
    "end",
  ];

  for (const state of defaultStates) {
    if (!basicAgent) {
      break;
    }
    if (!basicConfig.agentExecutePlan) {
      break;
    }

    if (!(state in basicConfig.agentExecutePlan)) {
      throw new Error(`Default state "${state}" is missing`);
    }
  }

  // Create agent with custom configuration
  const customAgent = new WrtnAgent({
    provider: {
      model: "gpt-4",
      api: new OpenAI({
        apiKey: process.env.CHATGPT_API_KEY,
      }),
      type: "chatgpt",
    },
    controllers: [],
    config: {
      agentExecutePlan: {
        describe: {
          execute: () => [] as IWrtnAgentPrompt[],
          nextAgent:
            IWrtnAdditionalAgent.DEFAULT_CHATGPT_AGENT.describe.nextAgent,
        },
        new: {
          execute: () => [] as IWrtnAgentPrompt[],
          nextAgent: () => "describe" as const,
        },
      },
    },
  });

  // Check if custom configuration is properly merged with default configuration
  const customConfig = customAgent.getConfig();
  if (!("agentExecutePlan" in customConfig)) {
    throw new Error("Custom agentExecutePlan is missing");
  }

  // 1. Check if all default states are maintained
  for (const state of defaultStates) {
    if (!customConfig.agentExecutePlan) {
      break;
    }
    if (!(state in customConfig.agentExecutePlan)) {
      throw new Error(
        `Default state "${state}" is missing after custom configuration`,
      );
    }
  }

  // 2. Check if custom state 'new' is added
  if (
    customConfig.agentExecutePlan &&
    !("new" in customConfig.agentExecutePlan)
  ) {
    throw new Error("Custom state 'new' was not added");
  }

  // 3. Check if describe state is properly overridden
  const customDescribe = customConfig?.agentExecutePlan?.["describe"];
  if (!customDescribe) {
    throw new Error("Custom describe is missing");
  }
  const customDescribeResult = await customDescribe.execute(
    {} as IWrtnAgentContext, // mock context
    [], // mock previous result
    [], // mock histories
  );

  if (customDescribeResult.length !== 0) {
    throw new Error("Custom describe.execute was not applied");
  }

  // 4. Check if describe's nextAgent maintains default value
  const defaultDescribeNextAgent =
    IWrtnAdditionalAgent.DEFAULT_CHATGPT_AGENT.describe.nextAgent;
  if (customDescribe.nextAgent !== defaultDescribeNextAgent) {
    throw new Error("describe.nextAgent does not maintain default value");
  }

  // 5. Check if new state's nextAgent returns "describe"
  const newStateNextAgent = customConfig?.agentExecutePlan?.["new"]?.nextAgent;
  if (!newStateNextAgent) {
    throw new Error("Custom new state's nextAgent is missing");
  }
  const nextState = await newStateNextAgent({} as IWrtnAgentContext, [], []);
  if (nextState !== "describe") {
    throw new Error(
      `new state's nextAgent does not return "describe". Return value: ${nextState}`,
    );
  }

  return await Promise.resolve();
}
