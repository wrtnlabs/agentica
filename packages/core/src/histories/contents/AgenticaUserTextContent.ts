import type { AgenticaUserContentBase } from "./AgenticaUserContentBase";

/**
 * Text content by user.
 *
 * @reference https://platform.openai.com/docs/guides/text-generation
 * @author Samchon
 * @author SunRabbit
 */
export interface AgenticaUserTextContent extends AgenticaUserContentBase<"text"> {
  /**
   * The text content.
   */
  text: string;
}
