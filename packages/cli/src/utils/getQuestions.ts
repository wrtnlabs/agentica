import { QuestionCollection } from "inquirer";
import { blueBright } from "./styleText";

export interface GetQuestionsInput {
  services: {
    name: string;
    value: string;
  }[];
}

export const getQuestions = (
  input: GetQuestionsInput,
): QuestionCollection[] => {
  return [
    {
      type: "list",
      name: "packageManager",
      message: "Package Manager",
      choices: [
        "npm",
        "pnpm",
        `yarn (berry ${blueBright("is not supported")})`,
        "bun",
      ],
    },
    {
      type: "list",
      name: "projectType",
      message: "Project Type",
      choices: [
        `NodeJS ${blueBright("Agent Server")}`,
        `NestJS ${blueBright("Agent Server")}`,
        `React ${blueBright("Client Application")}`,
        `Standard ${blueBright("Application")}`,
      ],
    },
    {
      type: "checkbox",
      name: "services",
      message: "Embedded Controllers",
      choices: input.services,
    },
    {
      type: "input",
      name: "openAIKey",
      message: "Please enter your OPEN_AI_API_KEY:",
    },
  ];
};
