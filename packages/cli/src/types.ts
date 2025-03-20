/**
 * Value of the `--project` option.
 */
export type ProjectOptionValue =
  | "nodejs"
  | "nestjs"
  | "react"
  | "standalone"
  | "nestjs+react";

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
}

/**
 * Types about options for `npx agentica start` command.
 *
 * @author Michael
 */
export namespace IAgenticaStartOption {
  export interface IProject {
    projectName: string;
    projectPath: string;
    openAIKey: string;
    services: string[];
  }
}
