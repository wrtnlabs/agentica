import type OpenAI from "openai";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && Array.isArray(value) === false;
}

function collect(source: unknown): Record<string, unknown> | undefined {
  if (isRecord(source) === false) {
    return undefined;
  }
  const output: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("reasoning") && value !== undefined) {
      output[key] = value;
    }
  }
  return Object.keys(output).length === 0
    ? undefined
    : output;
}

function assign<Message extends OpenAI.ChatCompletionAssistantMessageParam>(
  message: Message,
  payload: Record<string, unknown> | undefined,
): Message {
  const collected = collect(payload);
  if (collected === undefined) {
    return message;
  }
  return {
    ...message,
    ...collected,
  };
}

function assignFrom<Message extends OpenAI.ChatCompletionAssistantMessageParam>(
  message: Message,
  source: unknown,
): Message {
  return assign(message, collect(source));
}

export const ChatGptAssistantMessageUtil = {
  assign,
  assignFrom,
  collect,
};
