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
