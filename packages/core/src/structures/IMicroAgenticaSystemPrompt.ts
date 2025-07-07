import type { ILlmSchema } from "@samchon/openapi";

import type { AgenticaJsonParseErrorEvent } from "../events/AgenticaJsonParseErrorEvent";
import type { AgenticaValidateEvent } from "../events/AgenticaValidateEvent";
import type { AgenticaExecuteHistory } from "../histories/AgenticaExecuteHistory";
import type { MicroAgenticaHistory } from "../histories/MicroAgenticaHistory";

import type { IMicroAgenticaConfig } from "./IMicroAgenticaConfig";

/**
 * System prompt collection of the Micro Agentic AI.
 *
 * `IMicroAgenticaSystemPrompt` is a type represents a collection of
 * system prompts that would be used by the A.I. chatbot of
 * {@link MicroAgentica}.
 *
 * You can customize the system prompt by configuring the
 * {@link IMicroAgenticaConfig.systemPrompt} property when creating a new
 * {@link MicroAgentica} instance.
 *
 * If you don't configure any system prompts, the default system prompts
 * would be used which are written in the below directory as markdown
 * documents.
 *
 * - https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts
 *
 * @author Samchon
 */
export interface IMicroAgenticaSystemPrompt<Model extends ILlmSchema.Model> {
  /**
   * Common system prompt that would be used in every situation.
   *
   * This prompt establishes the foundational behavior and personality of
   * the Micro Agentic AI across all interaction phases. It defines the
   * agent's core identity, communication style, and general operating
   * principles that remain consistent throughout the streamlined conversation
   * flow. Unlike the full Agentica system, MicroAgentica focuses on
   * simplified, direct interactions with reduced complexity.
   *
   * @param config Configuration of the micro agent
   * @returns The common system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/common.md
   */
  common?: (config?: IMicroAgenticaConfig<Model> | undefined) => string;

  /**
   * Execute system prompt.
   *
   * The {@link MicroAgentica} has a streamlined process for filling the
   * arguments of functions by the LLM (Large Language Model) function
   * calling feature with the previous prompt histories, and executing
   * the arguments filled function with validation feedback.
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
   * Note: This can be set to `null` to disable the execute phase in
   * MicroAgentica, making it a pure conversational agent without
   * function calling capabilities.
   *
   * @param histories Histories of the previous prompts
   * @returns execute system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/execute.md
   */
  execute?: null | ((histories: MicroAgenticaHistory<Model>[]) => string);

  /**
   * Validation feedback system prompt.
   *
   * When the AI generates function arguments that fail type validation
   * during the execution phase, this prompt provides the system instructions
   * for analyzing {@link IValidation.IFailure} results and generating
   * corrective feedback in the MicroAgentica environment.
   *
   * This specialized prompt enables the AI to:
   * - Parse detailed validation error information from typia validation results
   * - Identify specific type mismatches, missing properties, and format violations
   * - Handle complex union type failures with discriminator property analysis
   * - Generate actionable correction guidance for parameter regeneration
   * - Distinguish between partial fixes and complete reconstruction scenarios
   *
   * The validation feedback agent in MicroAgentica operates with the same
   * precision as the full Agentica system but in a more streamlined context.
   * It acts as an intermediary between the micro AI agent and the function
   * execution system, providing structured feedback that helps improve
   * function calling accuracy through iterative correction.
   *
   * Key capabilities include:
   * - Union type analysis with discriminator property detection
   * - Granular error path reporting (e.g., "input.user.profile.age")
   * - Format-specific guidance (UUID, email, numeric constraints)
   * - Complete reconstruction recommendations for incompatible values
   * - Optimized for the simplified MicroAgentica interaction model
   *
   * @param events The previous validation events containing the IValidation.IFailure
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
   * The {@link MicroAgentica} has a process describing the return values of
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
   * for comprehensive reporting in the MicroAgentica streamlined environment.
   *
   * @param histories Histories of the previous prompts and their execution results
   * @returns describe system prompt
   * @default https://github.com/wrtnlabs/agentica/tree/main/packages/core/prompts/describe.md
   */
  describe?: (histories: AgenticaExecuteHistory<Model>[]) => string;
}
