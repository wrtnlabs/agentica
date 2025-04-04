import type { ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import type { MicroAgenticaEvent } from "../events/MicroAgenticaEvent";
import type { AgenticaTextPrompt } from "../prompts/AgenticaTextPrompt";
import type { MicroAgenticaPrompt } from "../prompts/MicroAgenticaPrompt";
import type { IMicroAgenticaConfig } from "../structures/IMicroAgenticaConfig";

import type { AgenticaOperationCollection } from "./AgenticaOperationCollection";

export interface MicroAgenticaContext<Model extends ILlmSchema.Model> {
  // ----
  // APPLICATION
  // ----
  /**
   * Collection of operations.
   *
   * Collection of operations from every controllers, and their
   * groups composed by the divide and conquer rule for the
   * efficient operation selection if configured.
   */
  operations: AgenticaOperationCollection<Model>;

  /**
   * Configuration of the agent.
   *
   * Configuration of the agent, that is used when constructing the
   * {@link Agentica} instance.
   *
   * @todo Write detaily after supporting the agent customization feature
   */
  config: IMicroAgenticaConfig<Model> | undefined;

  // ----
  // STATES
  // ----
  /**
   * Prompt histories.
   */
  histories: MicroAgenticaPrompt<Model>[];

  /**
   * Text prompt of the user.
   *
   * Text conversation written the by user through the
   * {@link Agentica.conversate} function.
   */
  prompt: AgenticaTextPrompt<"user">;

  // ----
  // HANDLERS
  // ----
  /**
   * Dispatch event.
   *
   * Dispatch event so that the agent can be handle the event
   * through the {@link Agentica.on} function.
   *
   * @param event Event to deliver
   */
  dispatch: (event: MicroAgenticaEvent<Model>) => Promise<void>;

  /**
   * Request to the OpenAI server.
   *
   * @param source The source agent of the agent
   * @param body The request body to the OpenAI server
   * @returns Response from the OpenAI server
   */
  request: (
    source: MicroAgenticaEvent.Source,
    body: Omit<OpenAI.ChatCompletionCreateParamsStreaming, "model" | "stream">,
  ) => Promise<ReadableStream<OpenAI.Chat.Completions.ChatCompletionChunk>>;
}
