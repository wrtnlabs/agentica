import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaExecutePrompt } from "../prompts/AgenticaExecutePrompt";
import type { MicroAgenticaPrompt } from "../prompts/MicroAgenticaPrompt";

import type { IMicroAgenticaConfig } from "./IMicroAgenticaConfig";

export interface IMicroAgenticaSystemPrompt<Model extends ILlmSchema.Model> {
  /**
   * Common system prompt that would be used in every situation.
   *
   * @param config Configuration of the agent
   * @returns The common system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/common.md
   */
  common?: (config?: IMicroAgenticaConfig<Model> | undefined) => string;

  /**
   * Execute system prompt.
   *
   * The {@link Agentica} has a process filling the arguments of some
   * selected candidate functions by the LLM (Large Language Model)
   * function calling feature with the previous prompt histories, and
   * executing the arguments filled function with validation feedback.
   *
   * In that case, this `execute` system prompt would be used. You can
   * customize it by assigning this function with the given
   * {@link AgenticaPrompt histories} parameter.
   *
   * @param histories Histories of the previous prompts
   * @returns execute system prompt
   * https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/execute.md
   */
  execute?: (histories: MicroAgenticaPrompt<Model>[]) => string;

  /**
   * Describe system prompt.
   *
   * The {@link Agentica} has a process describing the return values of
   * the executed functions by requesting to the A.I. agent with the
   * previous prompt histories.
   *
   * In that case, this `describe` system prompt would be used. You can
   * customize it by assigning this function with the given
   * {@link AgenticaPrompt histories} parameter.
   *
   * @param histories Histories of the previous prompts
   * @returns describe system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/describe.md
   */
  describe?: (histories: AgenticaExecutePrompt<Model>[]) => string;
}
