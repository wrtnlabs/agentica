import type OpenAI from "openai";

import type { AgenticaEvent } from "../events/AgenticaEvent";
import type { AgenticaEventSource } from "../events/AgenticaEventSource";
import type { AgenticaHistory } from "../histories/AgenticaHistory";
import type { AgenticaUserMessageHistory } from "../histories/AgenticaUserMessageHistory";
import type { IAgenticaConfig } from "../structures/IAgenticaConfig";

import type { AgenticaOperationCollection } from "./AgenticaOperationCollection";
import type { AgenticaOperationSelection } from "./AgenticaOperationSelection";

/**
 * Context of the Agentic AI agent.
 *
 * `AgenticaContext` is a structure defining the context of the
 * internal agents composing the {@link Agentica}, like function
 * selector, executor, and describer, and so on. For example, if an
 * agent has been configured to utilize the OpenAI, the context will
 * be delivered to the below components.
 *
 * - {@link orchestrate.execute}
 *   - {@link orchestrate.initialize}
 *   - {@link orchestrate.select}
 *   - {@link orchestrate.call}
 *   - {@link orchestrate.describe}
 *   - {@link orchestrate.cancel}
 *
 * Also, as its name is context, it contains every information that
 * is required to interact with the AI vendor like OpenAI. It
 * contains every operations for LLM function calling, and
 * configuration used for the agent construction. And it contains
 * the prompt histories, and facade controller functions for
 * interacting with the {@link Agentica} like {@link dispatch}.
 *
 * In such reasons, if you're planning to customize some internal
 * agents, or add new agents with new process routine, you have to
 * understand this context structure. Otherwise you don't have any
 * plan to customize the internal agents, this context information is
 * not important for you.
 *
 * @author Samchon
 */
export interface AgenticaContext {
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
  operations: AgenticaOperationCollection;

  /**
   * Configuration of the agent.
   *
   * Configuration of the agent, that is used when constructing the
   * {@link Agentica} instance.
   *
   * @todo Write detaily after supporting the agent customization feature
   */
  config: IAgenticaConfig | undefined;

  // ----
  // STATES
  // ----
  /**
   * Prompt histories.
   */
  histories: AgenticaHistory[];

  /**
   * Stacked operations.
   *
   * In other words, list of candidate operations for the LLM function calling.
   */
  stack: AgenticaOperationSelection[];

  /**
   * The user input history.
   *
   * The user input history written by the user through the
   * {@link Agentica.conversate} function.
   */
  prompt: AgenticaUserMessageHistory;

  /**
   * Abort signal.
   */
  abortSignal?: AbortSignal;

  /**
   * Whether the agent is ready.
   *
   * Returns a boolean value indicates whether the agent is ready to
   * perform the function calling.
   *
   * If the agent has called the {@link AgenticaContext.initialize},
   * it returns `true`. Otherwise the {@link initialize} has never been
   * called, returns `false`.
   */
  ready: () => boolean;

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
  dispatch: (event: AgenticaEvent) => Promise<void>;

  /**
   * Request to the OpenAI server.
   *
   * @param source The source agent of the agent
   * @param body The request body to the OpenAI server
   * @returns Response from the OpenAI server
   */
  request: (
    source: AgenticaEventSource,
    body: Omit<OpenAI.ChatCompletionCreateParamsStreaming, "model" | "stream">,
  ) => Promise<ReadableStream<OpenAI.Chat.Completions.ChatCompletionChunk>>;

  /**
   * Initialize the agent.
   */
  initialize: () => Promise<void>;
}
