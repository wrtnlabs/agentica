import { execSync } from "child_process";
import fs from "fs/promises";
import inquirer from "inquirer";
import path from "path";
import typia from "typia";

import { Package } from "../bases/Package";
import { AgenticaStarter } from "../functional/AgenticaStarter";
import { IAgenticaStart } from "../structures/IAgenticaStart";
import { getNpmPackages } from "../utils/getNpmPackages";
import { getQuestions } from "../utils/getQuestions";
import { redBright, yellow } from "../utils/styleText";
import { PackageManager } from "../utils/types/PackageManager";
import { ProjectOptionValue } from "../utils/types/ProjectOption";

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
        : (await getNpmPackages()).sort((a, b) => a.name.localeCompare(b.name));

    const questions = getQuestions({ services: availableServices, options });

    const answers = await inquirer.prompt<{
      projectType: ProjectOptionValue;
      services?: string[];
      packageManager: PackageManager;
      openAIKey: string;
    }>(questions);

    const config = {
      ...answers,
      ...(options.project ? { projectType: options.project } : {}),
      ...(answers.services ? { services: answers.services } : { services: [] }),
    };

    const validAnswers = typia.assert(config);
    const { packageManager, openAIKey, projectType, services } = validAnswers;

    await AgenticaStarter.execute(projectType)({
      projectName,
      projectPath,
      openAIKey,
      services,
    });

    process.chdir(projectPath);

    // Run package installation
    console.log("📦 Package installation in progress...");

    Package.installPackage(packageManager)({
      projectPath,
      services,
    });

    console.log(`\n🎉 Project ${projectName} created`);

    console.log(
      `\n⚠️  ${yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts`,
    );
  }
}
