import type { ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import type { MicroAgenticaEvent } from "../events/MicroAgenticaEvent";
import type { AgenticaUserMessageHistory } from "../histories/AgenticaUserMessageHistory";
import type { MicroAgenticaHistory } from "../histories/MicroAgenticaHistory";
import type { IMicroAgenticaConfig } from "../structures/IMicroAgenticaConfig";

import type { AgenticaOperationCollection } from "./AgenticaOperationCollection";

/**
 * Context of the Micro Agentic AI agent.
 *
 * `MicroAgenticaContext` is a structure defining the context of the
 * internal agents composing the {@link MicroAgentica}.
 *
 * It contains every information that is required to interact with
 * the AI vendor like OpenAI. It contains every operations for LLM
 * function calling, and configuration used for the agent construction.
 * And it contains the prompt histories, and facade controller
 * functions for interacting with the {@link MicroAgentica} like
 * {@link dispatch}.
 *
 * In such reasons, if you're planning to customize some internal
 * agents, or add new agents with new process routine, you have to
 * understand this context structure. Otherwise you don't have any
 * plan to customize the internal agents, this context information is
 * not important for you.
 *
 * @author Samchon
 */
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
  histories: MicroAgenticaHistory<Model>[];

  /**
   * Text prompt of the user.
   *
   * Text conversation written the by user through the
   * {@link Agentica.conversate} function.
   */
  prompt: AgenticaUserMessageHistory;

  // ----
  // HANDLERS
  // ----
  /**
   * Dispatch event.
   *
   * Dispatch event so that the agent can be handle the event
   * through the {@link MicroAgentica.on} function.
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
