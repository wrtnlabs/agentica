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
   * Image URL or base64 data itself.
   */
  image: AgenticaUserMessageImageContent.IUrl | AgenticaUserMessageImageContent.IBase64;

  /**
   * Specifies the detail level of the image.
   *
   * @reference https://platform.openai.com/docs/guides/vision#low-or-high-fidelity-image-understanding
   */
  detail?: "auto" | "high" | "low" | undefined;
}
export namespace AgenticaUserMessageImageContent {
  export interface IUrl {
    type: "url";
    url: string & tags.Format<"url">;
  }
  export interface IBase64 {
    type: "base64";
    data: string;
  }
}
