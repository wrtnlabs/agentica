import process from "node:process";
import fs from "node:fs/promises";
import path from "node:path";
import inquirer from "inquirer";
import typia from "typia";

import { Package } from "../bases/Package";
import { AgenticaStarter } from "../functional/AgenticaStarter";
import { IAgenticaStart } from "../structures/IAgenticaStart";
import { getConnectors } from "../utils/getConnectors";
import { getQuestions } from "../utils/getQuestions";
import { redBright, yellow } from "../utils/styleText";
import { PackageManager } from "../packages/consts";
import type { ProjectOptionValue } from "../types/ProjectOption";

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
