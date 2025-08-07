import type { AgenticaUserMessageContentBase } from "./AgenticaUserMessageContentBase";

/**
 * File content by user.
 *
 * @reference https://platform.openai.com/docs/api-reference/uploads/create
 * @author SunRabbit
 */
export interface AgenticaUserMessageFileContent extends AgenticaUserMessageContentBase<"file"> {
  /**
   * Reference to the pre-uploaded file or the base64 data itself.
   */
  file: AgenticaUserMessageFileContent.IId | AgenticaUserMessageFileContent.IBase64;
}
export namespace AgenticaUserMessageFileContent {
  export interface IId {
    type: "id";
    id: string;
  }
  export interface IBase64 {
    type: "base64";
    name: string;
    data: string;
  }
}
