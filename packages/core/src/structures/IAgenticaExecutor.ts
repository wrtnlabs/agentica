import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaContext } from "../context/AgenticaContext";
import type { AgenticaOperation } from "../context/AgenticaOperation";
import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { AgenticaPrompt } from "../prompts/AgenticaPrompt";

/**
 * Executor of the Agentic AI.
 *
 * `IAgenticaExecutor` represents an executor of the {@link Agentica},
 * composing its internal agents to accomplish the Agentic AI through
 * the LLM (Large Language Model) function calling.
 *
 * You can customize one of these internal agents by configuring
 * properties of the `IAgenticaExecutor` type, and assigning it to the
 * {@link IAgenticaConfig.executor} property. If you set the
 * {@link initialize} as `null` value, the {@link Agentica} will skip
 * the initialize process and directly go to the {@link select} process.
 *
 * By the way, when customizing the executor member, it would better to
 * reference the guide documents of `@agentica/core`, and internal
 * agents' implementation code. It's because if you take some mistake on
 * the executor logic, it can entirely break the {@link Agentica}'s
 * operation.
 *
 * @reference https://github.com/wrtnlabs/agentica?tab=readme-ov-file#principles
 * @reference https://github.com/wrtnlabs/agentica/blob/main/packages/agent/src/chatgpt/ChatGptAgent.ts
 * @author Samchon
 */
export interface IAgenticaExecutor<Model extends ILlmSchema.Model> {
  /**
   * Initializer agent listing up functions.
   *
   * `initialize` agent is the first agent that {@link Agentica}
   * would meet  which judges whether the user's conversation implies
   * to call some function or not.
   *
   * And if the `initialize` agent judges the user's conversation
   * implies to call some function, the `initialize` agent will
   * call the {@link AgenticaContext.initialize} function, and
   * inform every functions enrolled in the {@link IAgenticaController}
   * to the AI agent. And then, the `initialize` agent will not never
   * be called again, and let {@link Agentica} to go to the next
   * {@link select} agent.
   *
   * Otherwise the user's conversation does not imply the request of
   * function calling, it would just work like plain chatbot, and just
   * conversate with the user.
   *
   * By the way, if you wanna skip the `initialize` agent, you can
   * do it by configuring the {@link IAgenticaConfig.executor} as
   * `null` value. In that case, the `initialize` agent will never be
   * called, and {@link Agentica} just starts from the {@link select}
   * agent.
   *
   * @param ctx Context of the agent
   * @returns List of prompts generated by the initializer
   */
  initialize:
    | null
    | ((ctx: AgenticaContext<Model>) => Promise<AgenticaPrompt<Model>[]>);

  /**
   * Function selector agent.
   *
   * `Select` agent finds candidate functions to call from the
   * conversation context with the user. And the candidate functions
   * would be enrolled to the {@link AgenticaContext.stack}, and the
   * next {@link call} agent will perform the LLM (Large Language Model)
   * function calling.
   *
   * Note that, the `select` agent does not perform the LLM function
   * calling. It ends with just finding the candidate functions to call.
   *
   * By the way, if the `select` agent can't specify a certain function
   * to call due to lack of conversation context or homogeneity between
   * heterogeneous functions, how `select` agent works? In that case,
   * `select` agent it will just enroll every candidate functions to
   * the stack, and let the next {@link call} agent to determine the
   * proper function to call. And then let {@link cancel} agent to erase
   * the other candidate functions from the stack.
   *
   * Additionally, if `select` agent could not find any candidate
   * function from the conversation context with user, it would just
   * act like plain chatbot conversating with the user.
   *
   * @param ctx Context of the agent
   * @returns List of prompts generated by the selector
   */
  select: (ctx: AgenticaContext<Model>) => Promise<AgenticaPrompt<Model>[]>;

  /**
   * Function caller agent.
   *
   * `Call` agent performs the LLM (Large Language Model) function
   * calling from the candidate functions enrolled in the
   * {@link AgenticaContext.stack}. And the scope of function calling
   * is, not only just arguments filling, but also actual executing
   * the function and returning the result.
   *
   * By the way, conversation context with user can be not enough to
   * filling the arguments of the candidate functions. In that case,
   * the `call` agent will ask the user to fill the missing arguments.
   *
   * Otherwise the cpnversation context is enough, so that succeeded
   * to call some candidate functions, the `call` agent will step to
   * the {@link describe} agent to explain the result of the function
   * calling to the user as markdown content.
   *
   * @param ctx Context of the agent
   * @param operation Lit of candidate operations to call
   * @returns List of prompts generated by the caller
   * @warning Recommend not to customize, due to its validation
   *          feedback strategy is working very well, and the `call`
   *          agent is the most general topic which can be universally
   *          applied to all domain fields.
   */
  call: (ctx: AgenticaContext<Model>, operations: AgenticaOperation<Model>[]) => Promise<AgenticaPrompt<Model>[]>;

  /**
   * Describer agent of the function calling result.
   *
   * `Describe` agent explains the results of the function callings
   * to the user as markdown content.
   *
   * @param ctx Context of the agent
   * @param executes List of function calling results
   * @returns List of prompts generated by the describer
   */
  describe: (
    ctx: AgenticaContext<Model>,
    executes: AgenticaExecutePrompt<Model>[],
  ) => Promise<AgenticaPrompt<Model>[]>;

  /**
   * Function canceler agent.
   *
   * `Cancel` agent erases the candidate functions from the
   * {@link AgenticaContext.stack} by analyzing the conversation
   * context with the user.
   *
   * For reference, the first reason of the cancelation is explicit
   * order from user to the previous requested function. For example,
   * user had requested to send an email to the agent, but suddenly
   * user says to cancel the email sending.
   *
   * The seconod reason n of the cancelation is the multiple candidate
   * functions had been selected at once by the {@link select} agent
   * due to lack of conversation context or homogeneity between the
   * heterogeneous functions. And in the multiple candidate functions,
   * one thing is clearly determined by the {@link call} agent, so that
   * drop the other candidate functions.
   *
   * @param ctx Context of the agent
   * @returns List of prompts generated by the canceler
   */
  cancel: (ctx: AgenticaContext<Model>) => Promise<AgenticaPrompt<Model>[]>;
}
