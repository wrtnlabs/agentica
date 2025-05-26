import type { AgenticaUserMessageContentBase } from "./AgenticaUserMessageContentBase";

/**
 * Text content by user.
 *
 * @reference https://platform.openai.com/docs/guides/text-generation
 * @author Samchon
 * @author SunRabbit
 */
export interface AgenticaUserMessageTextContent extends AgenticaUserMessageContentBase<"text"> {
  /**
   * The text content.
   */
  text: string;
}
