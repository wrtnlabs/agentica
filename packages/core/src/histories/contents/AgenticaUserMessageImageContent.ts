import type { tags } from "typia";

import type { AgenticaUserMessageContentBase } from "./AgenticaUserMessageContentBase";

/**
 * Image content by user.
 *
 * @reference https://platform.openai.com/docs/guides/vision
 * @author SunRabbit
 */
export interface AgenticaUserMessageImageContent extends AgenticaUserMessageContentBase<"image"> {
  /**
   * Image URL.
   */
  url: string & tags.Format<"url">;

  /**
   * Specifies the detail level of the image.
   *
   * @reference https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding
   */
  detail?: "auto" | "high" | "low" | undefined;
}
