import type { tags } from "typia";

import type { AgenticaUserContentBase } from "./AgenticaUserContentBase";

/**
 * Image content by user.
 *
 * @reference https://platform.openai.com/docs/guides/vision
 * @author SunRabbit
 */
export interface AgenticaUserImageContent extends AgenticaUserContentBase<"image"> {
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
