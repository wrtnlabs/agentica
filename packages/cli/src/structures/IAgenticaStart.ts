import { ProjectOptionValue } from "../utils/types/ProjectOption";

/**
 * Types about `npx agentica start` command.
 *
 * @author Michael
 */
export namespace IAgenticaStart {
  /**
   * Options for `npx agentica start` command.
   */
  export type IOptions = Partial<{
    project: ProjectOptionValue;
  }>;

  /**
   * Parameters for execute `npx agentica start` command.
   */
  export interface IExecuteInput {
    projectName: string;
    options: IOptions;
  }

  /**
   * Input for `getQuestions` function.
   */
  export interface IGetQuestionsInput {
    services: {
      name: string;
      value: string;
    }[];
  }
}
