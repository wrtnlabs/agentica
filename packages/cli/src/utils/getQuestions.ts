import chalk from "chalk";

export interface GetQuestionsInput {
  services: {
    name: string;
    value: string;
  }[];
}

export const getQuestions = (input: GetQuestionsInput) => {
  return [
    {
      type: "list",
      name: "packageManager",
      message: "Package Manager",
      choices: [
        "npm",
        "pnpm",
        `yarn (berry ${chalk.blueBright("is not supported")})`,
      ],
    },
    {
      type: "list",
      name: "projectType",
      message: "Project Type",
      choices: [
        `NodeJS ${chalk.blueBright("Agent Server")}`,
        `NestJS ${chalk.blueBright("Agent Server")}`,
        `React ${chalk.blueBright("Client Application")}`,
        `Standard ${chalk.blueBright("Application")}`,
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
