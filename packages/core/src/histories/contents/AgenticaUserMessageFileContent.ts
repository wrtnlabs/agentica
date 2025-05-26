import type { AgenticaUserMessageContentBase } from "./AgenticaUserMessageContentBase";

/**
 * File content by user.
 *
 * @reference https://platform.openai.com/docs/api-reference/uploads/create
 * @author SunRabbit
 */
export interface AgenticaUserMessageFileContent extends AgenticaUserMessageContentBase<"file"> {
  /**
   * Reference to the pre-uploaded file or the data itself.
   *
   * @todo Properly define independent interface
   */
  file: AgenticaUserMessageFileContent.IReference | AgenticaUserMessageFileContent.IData;
}
export namespace AgenticaUserMessageFileContent {
  export interface IReference {
    type: "reference";
    id: string;
  }
  export interface IData {
    type: "data";
    name: string;
    data: string;
  }
}
