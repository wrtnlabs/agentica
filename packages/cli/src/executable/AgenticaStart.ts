import process from "node:process";
import fs from "node:fs/promises";
import path from "node:path";
import inquirer, { QuestionCollection } from "inquirer";
import typia from "typia";

import { Package } from "../bases/Package";
import { AgenticaStarter } from "../functional/AgenticaStarter";
import { IAgenticaStart } from "../structures/IAgenticaStart";
import { blueBright, getConnectors } from "../utils";
import { redBright, yellow } from "../utils";
import { PackageManager } from "../packages/consts";
import type { ProjectOptionValue } from "../types";

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

export namespace AgenticaStart {
  /**
   * Execute `start` command.
   */
  export async function execute({
    projectName,
    options,
  }: IAgenticaStart.IExecuteInput) {
    const projectPath = path.join(process.cwd(), projectName);

    // Check if project already exists
    if (
      await fs
        .access(path.join(process.cwd(), projectName))
        .then(() => true)
        .catch(() => false)
    ) {
      console.error(`❌ Project ${redBright(projectName)} already exists`);
      return;
    }

    // Get connector package names from npm and sort alphabetically
    const availableServices =
      options.project === "react"
        ? []
        : (await getConnectors()).sort((a, b) => a.name.localeCompare(b.name));

    const questions = getQuestions({ services: availableServices, options });

    const answers = await inquirer.prompt<{
      projectType: ProjectOptionValue;
      services?: string[];
      packageManager: PackageManager;
      openAIKey: string;
      port?: string;
    }>(questions);

    const config = {
      ...answers,
      ...(options.project ? { projectType: options.project } : {}),
      ...(answers.services ? { services: answers.services } : { services: [] }),
    };

    const validAnswers = typia.assert(config);
    const {
      packageManager,
      openAIKey,
      projectType,
      services,
      port = "3000",
    } = validAnswers;

    await AgenticaStarter.execute(projectType)(packageManager)({
      projectName,
      projectPath,
      openAIKey,
      services,
      port,
    });

    console.log(`\n🎉 Project ${projectName} created`);

    console.log(
      `\n⚠️  ${yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts`,
    );
  }
}
