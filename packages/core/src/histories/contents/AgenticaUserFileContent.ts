import type { AgenticaUserContentBase } from "./AgenticaUserContentBase";

/**
 * File content by user.
 *
 * @reference https://platform.openai.com/docs/api-reference/uploads/create
 * @author SunRabbit
 */
export interface AgenticaUserFileContent extends AgenticaUserContentBase<"file"> {
  /**
   * Reference to the pre-uploaded file or the data itself.
   *
   * @todo Properly define independent interface
   */
  file: AgenticaUserFileContent.IReference | AgenticaUserFileContent.IData;
}
export namespace AgenticaUserFileContent {
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
