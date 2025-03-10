import { ILlmSchema } from "@samchon/openapi";
import OpenAI from "openai";

import { AgenticaSource } from "../typings/AgenticaSource";
import { IAgenticaConfig } from "./IAgenticaConfig";
import { IAgenticaEvent } from "./IAgenticaEvent";
import { IAgenticaOperationCollection } from "./IAgenticaOperationCollection";
import { IAgenticaOperationSelection } from "./IAgenticaOperationSelection";
import { IAgenticaPrompt } from "./IAgenticaPrompt";

/**
 * Context of the Nestia A.I. agent.
 *
 * `IAgenticaContext` is a structure defining the context of the
 * internal agents composing the {@link Agentica}, like function
 * selector, executor, and describer, and so on. For example, if an
 * agent has been configured to utilize the OpenAI, the context will
 * be delivered to the below components.
 *
 * - {@link ChatGptAgent}
 *   - {@link ChatGptInitializeFunctionAgent}
 *   - {@link ChatGptSelectFunctionAgent}
 *   - {@link ChatGptExecuteFunctionAgent}
 *   - {@link ChatGptDescribeFunctionAgent}
 *   - {@link ChatGptCancelFunctionAgent}
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
export interface IAgenticaContext<Model extends ILlmSchema.Model> {
  //----
  // APPLICATION
  //----
  /**
   * Collection of operations.
   *
   * Collection of operations from every controllers, and their
   * groups composed by the divide and conquer rule for the
   * efficient operation selection if configured.
   */
  operations: IAgenticaOperationCollection<Model>;

  /**
   * Configuration of the agent.
   *
   * Configuration of the agent, that is used when constructing the
   * {@link Agentica} instance.
   *
   * @todo Write detaily after supporting the agent customization feature
   */
  config: IAgenticaConfig<Model> | undefined;

  //----
  // STATES
  //----
  /**
   * Prompt histories.
   */
  histories: IAgenticaPrompt<Model>[];

  /**
   * Stacked operations.
   *
   * In other words, list of candidate operations for the LLM function calling.
   */
  stack: IAgenticaOperationSelection<Model>[];

  /**
   * Text prompt of the user.
   *
   * Text conversation written the by user through the
   * {@link Agentica.conversate} function.
   */
  prompt: IAgenticaPrompt.IText<"user">;

  /**
   * Whether the agent is ready.
   *
   * Returns a boolean value indicates whether the agent is ready to
   * perform the function calling.
   *
   * If the agent has called the {@link IAgenticaContext.initialize},
   * it returns `true`. Otherwise the {@link initialize} has never been
   * called, returns `false`.
   */
  ready: () => boolean;

  //----
  // HANDLERS
  //----
  /**
   * Dispatch event.
   *
   * Dispatch event so that the agent can be handle the event
   * through the {@link Agentica.on} function.
   *
   * @param event Event to deliver
   */
  dispatch: (event: IAgenticaEvent<Model>) => Promise<void>;

  /**
   * Request to the OpenAI server.
   *
   * @param source The source agent of the agent
   * @param body The request body to the OpenAI server
   * @returns Response from the OpenAI server
   */
  request: (
    source: AgenticaSource,
    body: Omit<OpenAI.ChatCompletionCreateParamsStreaming, "model" | "stream">,
  ) => Promise<ReadableStream<OpenAI.Chat.Completions.ChatCompletionChunk>>;

  /**
   * Initialize the agent.
   */
  initialize: () => Promise<void>;
}
