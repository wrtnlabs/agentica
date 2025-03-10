import chalk from "chalk";
import fs from "fs";
import inquirer from "inquirer";
import path from "path";

import { Connector } from "../bases/Connector";
import { Package } from "../bases/Package";
import { Tsconfig } from "../bases/Tsconfig";
import { createProjectDirectory } from "../utils/createProjectDirectory";
import { getNpmPackages } from "../utils/getNpmPackages";
import { getQuestions } from "../utils/getQuestions";

export namespace AgenticaStart {
  export async function execute(input: { projectName: string }) {
    const { projectName } = input;

    // Check if project already exists
    if (fs.existsSync(path.join(process.cwd(), projectName))) {
      console.error(
        `❌ Project ${chalk.redBright(projectName)} already exists`,
      );
      return;
    }

    // Get connector package names from npm and sort alphabetically
    const availableServices = (await getNpmPackages()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const questions = getQuestions({ services: availableServices });
    const answers = await inquirer.prompt(questions as any);
    const {
      packageManager,
      openAIKey,
      // projectType,
      services,
    }: {
      packageManager: "npm" | "yarn" | "pnpm";
      openAIKey: string;
      // projectType: string;
      services: string[];
    } = answers as any;

    // Create project folder
    const { projectPath } = createProjectDirectory({ projectName });

    // Create package.json (without dependencies)
    Package.create({ projectName, projectPath });

    // Create tsconfig.json
    Tsconfig.create({ projectPath });

    // Create .env file
    const envContent = `OPEN_AI_API_KEY=${openAIKey}\n`;
    fs.writeFileSync(path.join(projectPath, ".env"), envContent);
    console.log("✅ .env created");

    // Create Agentica code
    const agenticaCode = Connector.createAll({ services });
    fs.writeFileSync(path.join(projectPath, "agent.ts"), agenticaCode);
    console.log("✅ agentica.ts created");

    // Run package installation
    console.log("📦 Package installation in progress...");

    Package.installPackage(packageManager)({
      projectPath,
      services,
    });

    console.log(`🎉 Project ${projectName} created`);
  }
}
