import chalk from "chalk";
import cp from "child_process";
import fs from "fs/promises";
import inquirer, { QuestionCollection } from "inquirer";
import path from "path";
import prettier from "prettier";
import typia from "typia";

import { Connector } from "../bases/Connector";
import { Package } from "../bases/Package";
import { Tsconfig } from "../bases/Tsconfig";
import { IAgenticaStart } from "../structures/IAgenticaStart";
import { IAgenticaStartOption } from "../structures/IAgenticaStartOption";
import { createProjectDirectory } from "../utils/createProjectDirectory";
import { getNpmPackages } from "../utils/getNpmPackages";
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
      console.error(
        `❌ Project ${chalk.redBright(projectName)} already exists`,
      );
      return;
    }

    // Get connector package names from npm and sort alphabetically
    const availableServices = (await getNpmPackages()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );

    const questions = getQuestions({ services: availableServices, options });
    const answers = await inquirer.prompt(questions);

    const updatedAnswers = {
      ...answers,
      // options
      projectType: options.project ?? answers.projectType,
    };

    const validAnswers = typia.assert<{
      packageManager: PackageManager;
      openAIKey: string;
      services: string[];
      // Options
      projectType: ProjectOptionValue;
    }>(updatedAnswers);

    const { packageManager, openAIKey, projectType, services } = validAnswers;

    if (projectType === "standalone") {
      await AgenticaStartOption.Project.execute("standalone")({
        projectName,
        projectPath,
        openAIKey,
        services,
      });
    } else if (projectType === "nodejs") {
      await clone(projectType, projectName);

      await AgenticaStartOption.Project.execute("nodejs")({
        projectName,
        projectPath,
        openAIKey,
        services,
      });
    } else if (projectType === "nestjs") {
      await clone(projectType, projectName);

      await AgenticaStartOption.Project.execute("nestjs")({
        projectName,
        projectPath,
        openAIKey,
        services,
      });
    }

    // Run package installation
    console.log("📦 Package installation in progress...");

    Package.installPackage(packageManager)({
      projectPath,
      services,
    });

    console.log(`\n🎉 Project ${projectName} created`);

    console.log(
      `\n⚠️  ${chalk.yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts`,
    );
  }

  /**
   * Get questions for `start` command.
   */
  const getQuestions = (
    input: IAgenticaStart.IGetQuestionsInput,
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
            name: `yarn (berry ${chalk.blueBright("is not supported")})`,
            value: "yarn",
          },
        ],
      },
      input.options.project
        ? null
        : {
            type: "list",
            name: "projectType",
            message: "Project Type",
            choices: [
              {
                name: `NodeJS ${chalk.blueBright("Agent Server")}`,
                value: "nodejs",
              },
              {
                name: `NestJS ${chalk.blueBright("Agent Server")}`,
                value: "nestjs",
              },
              {
                name: `React ${chalk.blueBright("Client Application")}`,
                value: "react",
              },
              {
                name: `Standalone ${chalk.blueBright("Application")}`,
                value: "standalone",
              },
            ] satisfies { name: string; value: ProjectOptionValue }[],
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
        message: "Please enter your OPENAI_API_KEY:",
      },
    ] satisfies (QuestionCollection | null)[];

    return questions.filter((question) => question !== null);
  };

  /**
   * Git Clone from template repository.
   */
  export const clone = async (
    type: ProjectOptionValue,
    directory: string,
  ): Promise<void> => {
    const execute = (command: string): void => {
      console.log(`\n$ ${command}`);
      cp.execSync(command, { stdio: "inherit" });
    };

    // COPY PROJECTS
    execute(
      `git clone https://github.com/wrtnlabs/agentica.template.${type} ${directory}`,
    );
    process.chdir(directory);

    // REMOVE .GIT DIRECTORY
    cp.execSync("npx rimraf .git");
    cp.execSync("npx rimraf .github/dependabot.yml");
  };
}

/**
 * Methods for Agentica start options.
 */
namespace AgenticaStartOption {
  export namespace Project {
    export const execute = (option: ProjectOptionValue) => {
      switch (option) {
        case "standalone":
          return standalone;
        case "nodejs":
          return nodejs;
        case "nestjs":
          return nestjs;
        default:
          throw new Error(`Invalid project type: ${option}`);
      }
    };

    const standalone = async (
      input: IAgenticaStartOption.IProject,
    ): Promise<void> => {
      // Create project directory
      createProjectDirectory({ projectPath: input.projectPath });

      // Create package.json (without dependencies)
      Package.create({
        projectName: input.projectName,
        projectPath: input.projectPath,
      });

      // Create tsconfig.json
      Tsconfig.create({ projectPath: input.projectPath });

      await fs.mkdir(path.join(input.projectPath, "src"), {
        recursive: false,
      });

      // Create Agentica code
      const agenticaCode = Connector.createAll({ services: input.services });
      const formattedAgenticaCode = await prettier.format(agenticaCode, {
        parser: "typescript",
      });
      await fs.writeFile(
        path.join(input.projectPath, "src/agent.ts"),
        formattedAgenticaCode,
      );
      console.log("✅ agent.ts created");

      // Create .env file
      const envContent = `OPENAI_API_KEY=${input.openAIKey}\n`;
      await fs.writeFile(path.join(input.projectPath, ".env"), envContent);
      console.log("✅ .env created");
    };

    const nodejs = async (
      input: IAgenticaStartOption.IProject,
    ): Promise<void> => {
      // Create Agentica code
      const importCode = Connector.create("import")({
        services: input.services,
      });

      const connectorCode = Connector.create("connector")({
        services: input.services,
      });

      // Modify index.ts: replace import and controller code
      const indexFilePath = path.join(input.projectPath, "src/index.ts");
      const indexFileContent = await fs
        .readFile(indexFilePath, "utf-8")
        .then((content) => {
          if (input.services.length !== 0) {
            return content
              .replace(/import { BbsArticleService }.*;\n/g, "")
              .replace(
                /controllers:\s*\[[\s\S]*?\],\n/,
                "controllers: [/// INSERT CONTROLLER HERE],\n",
              );
          }
          return content;
        });

      // Insert importCode and connectorCode
      const updatedFileContent = indexFileContent
        .replace("/// INSERT IMPORT HERE", importCode)
        .replace("/// INSERT CONTROLLER HERE", connectorCode);

      const formattedFileContent = await prettier.format(updatedFileContent, {
        parser: "typescript",
      });

      await fs.writeFile(indexFilePath, formattedFileContent);

      console.log("✅ Agentica code created");

      // Add env to .env.local
      const envContent = `\nOPENAI_API_KEY=${input.openAIKey}\n`;
      await fs.appendFile(
        path.join(input.projectPath, ".env.local"),
        envContent,
      );
      console.log("✅ .env.local updated");
    };

    const nestjs = async (
      input: IAgenticaStartOption.IProject,
    ): Promise<void> => {
      // Create Agentica code
      const importCode = Connector.create("import")({
        services: input.services,
      });
      const connectorCode = Connector.create("connector")({
        services: input.services,
      });

      // Modify ChatController.ts: replace import and controller code
      const indexFilePath = path.join(
        input.projectPath,
        "src/controllers/chat/ChatController.ts",
      );

      // Insert importCode and connectorCode
      const indexFileContent = (await fs.readFile(indexFilePath, "utf-8"))
        .replace("/// INSERT IMPORT HERE", importCode)
        .replace("/// INSERT CONTROLLER HERE", connectorCode);

      const formattedFileContent = await prettier.format(indexFileContent, {
        parser: "typescript",
      });

      await fs.writeFile(indexFilePath, formattedFileContent);

      console.log("✅ Agentica code created");

      // Add env to .env.local
      const envContent = `\nOPENAI_API_KEY=${input.openAIKey}\n`;
      await fs.appendFile(
        path.join(input.projectPath, ".env.local"),
        envContent,
      );
      console.log("✅ .env.local updated");
    };
  }
}
