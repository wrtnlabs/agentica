import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaJsonParseErrorEvent } from "../events";
import type { AgenticaValidateEvent } from "../events/AgenticaValidateEvent";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { AgenticaHistory } from "../histories/AgenticaHistory";

import type { IAgenticaConfig } from "./IAgenticaConfig";

/**
 * System prompt collection of the Agentic AI.
 *
 * `IAgenticaSystemPrompt` is a type represents a collection of system
 * prompts that would be used by the A.I. chatbot of {@link Agentica}.
 *
 * You can customize the system prompt by configuring the
 * {@link IAgenticaConfig.systemPrompt} property when creating a new
 * {@link Agentica} instance.
 *
 * If you don't configure any system prompts, the default system prompts
 * would be used which are written in the below directory as markdown
 * documents.
 *
 * - https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts
 *
 * @author Samchon
 */
export interface IAgenticaSystemPrompt<Model extends ILlmSchema.Model> {
  /**
   * Common system prompt that would be used in every situation.
   *
   * This prompt establishes the foundational behavior and personality of
   * the AI agent across all interaction phases. It defines the agent's
   * core identity, communication style, and general operating principles
   * that remain consistent throughout the conversation flow.
   *
   * @param config Configuration of the agent
   * @returns The common system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/common.md
   */
  common?: (config?: IAgenticaConfig<Model> | undefined) => string;

  /**
   * Initialize system prompt.
   *
   * When the A.I. chatbot has not informed any functions to the agent
   * yet because the user has not implied any function calling request yet,
   * {@link Agentica} says that it is a circumstance that nothing has
   * been initialized yet.
   *
   * In that case, the `initialize` system prompt would be used. This is
   * the most basic prompt that simply establishes the AI as a helpful
   * assistant with access to supplied tools. It provides minimal guidance,
   * allowing the AI to respond naturally to user requests and automatically
   * identify when function calls are appropriate based on the available
   * tools and user context.
   *
   * The initialize prompt is intentionally simple and generic, serving as
   * a foundation for general conversation and tool usage without specific
   * constraints or specialized behaviors.
   *
   * @param histories Histories of the previous prompts
   * @returns initialize system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/initialize.md
   */
  initialize?: (histories: AgenticaHistory<Model>[]) => string;

  /**
   * Select system prompt.
   *
   * The {@link Agentica} has a process selecting some candidate
   * functions to call by asking to the A.I. agent with the previous
   * prompt histories.
   *
   * In that case, this `select` system prompt would be used. This prompt
   * specifically instructs the AI to use the `getApiFunctions()` tool to
   * select appropriate functions for the user's request. It emphasizes
   * the importance of analyzing function relationships and prerequisites
   * between functions to ensure proper execution order.
   *
   * The select prompt includes internationalization support, instructing
   * the AI to consider the user's language locale and translate responses
   * accordingly. If no suitable functions are found, the AI is allowed to
   * respond with its own message rather than forcing a function selection.
   *
   * Note that, the `"select"` means only the function selection. It does
   * not contain the filling argument or executing the function. It
   * literally contains only the selection process.
   *
   * @param histories Histories of the previous prompts
   * @returns select system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/select.md
   */
  select?: (histories: AgenticaHistory<Model>[]) => string;

  /**
   * Cancel system prompt.
   *
   * The {@link Agentica} has a process canceling some candidate
   * functions to call by asking to the A.I. agent with the previous
   * prompt histories.
   *
   * In that case, this `cancel` system prompt would be used. This prompt
   * provides very specific instructions for the AI to use the
   * `getApiFunctions()` tool to select functions that should be cancelled.
   *
   * The cancel prompt is notably strict - if the AI cannot find any
   * proper functions to cancel, it is explicitly instructed to remain
   * silent and take no action whatsoever ("don't talk, don't do anything").
   * This prevents unnecessary responses when cancellation is not applicable.
   *
   * @param histories Histories of the previous prompts
   * @returns cancel system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/cancel.md
   */
  cancel?: (histories: AgenticaHistory<Model>[]) => string;

  /**
   * Execute system prompt.
   *
   * The {@link Agentica} has a process filling the arguments of some
   * selected candidate functions by the LLM (Large Language Model)
   * function calling feature with the previous prompt histories, and
   * executing the arguments filled function with validation feedback.
   *
   * In that case, this `execute` system prompt would be used. This prompt
   * instructs the AI to use the supplied tools to assist the user, with
   * specific guidance on handling insufficient information scenarios.
   * When the AI lacks enough context to compose proper function arguments,
   * it is instructed to ask the user for additional information in a
   * concise and clear manner.
   *
   * The execute prompt also provides important context about the "tool"
   * role message structure, explaining that the `function` property
   * contains API operation metadata (schema, purpose, parameters, return
   * types) while the `data` property contains the actual return values
   * from function executions.
   *
   * @param histories Histories of the previous prompts
   * @returns execute system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/execute.md
   */
  execute?: (histories: AgenticaHistory<Model>[]) => string;

  /**
   * Validation feedback system prompt.
   *
   * When the AI generates function arguments that fail type validation
   * during the execution phase, this prompt provides the system instructions
   * for analyzing {@link IValidation.IFailure} results and generating
   * corrective feedback.
   *
   * This specialized prompt enables the AI to:
   * - Parse detailed validation error information from typia validation results
   * - Identify specific type mismatches, missing properties, and format violations
   * - Handle complex union type failures with discriminator property analysis
   * - Generate actionable correction guidance for parameter regeneration
   * - Distinguish between partial fixes and complete reconstruction scenarios
   *
   * The validation feedback agent acts as an intermediary between the main
   * AI agent and the function execution system, providing structured feedback
   * that helps improve function calling accuracy through iterative correction.
   * This is particularly valuable for complex function schemas where precise
   * type conformance is critical.
   *
   * Key capabilities include:
   * - Union type analysis with discriminator property detection
   * - Granular error path reporting (e.g., "input.user.profile.age")
   * - Format-specific guidance (UUID, email, numeric constraints)
   * - Complete reconstruction recommendations for incompatible values
   *
   * @props events The previous validation events containing the IValidation.IFailure
   * @returns validation feedback system prompt
   * @default Built-in validation feedback prompt optimized for typia IValidation.IFailure processing
   */
  validate?: (events: AgenticaValidateEvent<Model>[]) => string;

  /**
   * JSON parsing error system prompt.
   *
   * When the AI generates function arguments with invalid JSON syntax
   * that cannot be parsed by `JSON.parse()`, this prompt provides system
   * instructions for handling the parsing error and requesting corrected
   * function calls.
   *
   * This specialized prompt enables the AI to:
   * - Understand that the function call arguments contained malformed JSON
   * - Receive the specific error message from `JSON.parse()`
   * - Get guidance on common JSON syntax issues (trailing commas, quote problems, etc.)
   * - Retry the function call with properly formatted JSON arguments
   *
   * The JSON parse error prompt acts as an immediate correction mechanism
   * when function calling fails at the JSON parsing stage, before any
   * schema validation occurs. This ensures that basic JSON syntax compliance
   * is maintained for all function calls.
   *
   * Key features include:
   * - Direct error message reporting from `JSON.parse()`
   * - Clear identification of the problematic function call
   * - Specific guidance on JSON syntax requirements
   * - Immediate retry instruction without additional processing
   *
   * @param event The JSON parse error event containing the malformed arguments and error details
   * @returns JSON parse error system prompt
   * @default Built-in JSON parse error prompt optimized for syntax correction
   */
  jsonParseError?: (event: AgenticaJsonParseErrorEvent<Model>) => string;

  /**
   * Describe system prompt.
   *
   * The {@link Agentica} has a process describing the return values of
   * the executed functions by requesting to the A.I. agent with the
   * previous prompt histories.
   *
   * In that case, this `describe` system prompt would be used. This prompt
   * instructs the AI to provide detailed descriptions of function call
   * return values rather than brief summaries. It emphasizes comprehensive
   * reporting to ensure users receive thorough information about the
   * function execution results.
   *
   * The describe prompt specifies several formatting requirements:
   * - Content must be formatted in markdown
   * - Mermaid syntax should be utilized for diagrams when appropriate
   * - Images should be included using markdown image syntax
   * - Internationalization support with translation to user's language
   *   locale when the description language differs from the user's language
   *
   * The prompt receives execution histories specifically, allowing the AI
   * to access both the function metadata and actual execution results
   * for comprehensive reporting.
   *
   * @param histories Histories of the previous prompts and their execution results
   * @returns describe system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/describe.md
   */
  describe?: (histories: AgenticaExecuteHistory<Model>[]) => string;
}
