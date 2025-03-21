import { QuestionCollection } from "inquirer";

import { AgenticaStarter } from "../functional/AgenticaStarter";
import { IAgenticaStart } from "../structures/IAgenticaStart";
import { blueBright } from "./styleText";

export interface IGetQuestionsProps {
  services: {
    name: string;
    value: string;
  }[];

  options: IAgenticaStart.IOptions;
}

/**
 * Get questions for `start` command.
 */
export const getQuestions = (
  input: IGetQuestionsProps,
): QuestionCollection[] => {
  const questions = [
    {
      type: "list",
      name: "packageManager",
      message: "Package Manager",
      choices: [
        "npm",
        "pnpm",
        {
          name: `yarn (berry ${blueBright("is not supported")})`,
          value: "yarn",
        },
        "bun",
      ],
    },
    input.options.project
      ? null
      : {
          type: "list",
          name: "projectType",
          message: "Project Type",
          choices: Object.values(AgenticaStarter.PROJECT).map((project) => ({
            name: project.title,
            value: project.key,
          })),
        },
    input.options.project === "standalone"
      ? null
      : {
          type: "input",
          name: "port",
          message:
            "Server Port(if project is client app, this port mean ws server port):",
          default: "3000",
          when: (answers) => answers.projectType !== "standalone",
        },
    input.services.length === 0
      ? null
      : {
          type: "checkbox",
          name: "services",
          message: "Embedded Controllers",
          choices: input.services,
          when: (answers) => answers.projectType !== "react",
        },
    {
      type: "input",
      name: "openAIKey",
      message: "Please enter your OPENAI_API_KEY:",
    },
  ] satisfies (QuestionCollection | null)[];

  return questions.filter((question) => question !== null);
};
