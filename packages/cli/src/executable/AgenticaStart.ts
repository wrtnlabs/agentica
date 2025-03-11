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
import { createProjectDirectory } from "../utils/createProjectDirectory";
import { getNpmPackages } from "../utils/getNpmPackages";
import { PackageManager } from "../utils/types/PackageManager";
import { ProjectOptionValue } from "../utils/types/ProjectOption";

export namespace AgenticaStart {
  /**
   * Execute `start` command.
   */
  export async function execute(input: IAgenticaStart.IExecuteInput) {
    const { projectName, options } = input;
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

    const questions = getQuestions({ services: availableServices }, options);
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
      // Create project directory
      createProjectDirectory({ projectPath });

      // Create package.json (without dependencies)
      Package.create({ projectName, projectPath });

      // Create tsconfig.json
      Tsconfig.create({ projectPath });

      await fs.mkdir(path.join(projectPath, "src"), { recursive: false });

      // Create Agentica code
      const agenticaCode = Connector.createAll({ services });
      const formattedAgenticaCode = await prettier.format(agenticaCode, {
        parser: "typescript",
      });
      await fs.writeFile(
        path.join(projectPath, "src/agent.ts"),
        formattedAgenticaCode,
      );
      console.log("✅ agent.ts created");

      // Create .env file
      const envContent = `OPENAI_API_KEY=${openAIKey}\n`;
      await fs.writeFile(path.join(projectPath, ".env"), envContent);
      console.log("✅ .env created");
    } else {
      await clone(projectType, projectName);

      // Create Agentica code
      const importCode = Connector.create("import")({ services });
      const connectorCode = Connector.create("connector")({ services });

      // Modify index.ts: replace import and controller code
      const indexFilePath = path.join(projectPath, "src/index.ts");
      let indexFileContent = await fs.readFile(indexFilePath, "utf-8");

      if (services.length !== 0) {
        // Remove BbsArticleService import and controllers code
        indexFileContent = indexFileContent.replace(
          /import { BbsArticleService }.*;\n/g,
          "",
        );

        indexFileContent = indexFileContent.replace(
          /controllers:\s*\[[\s\S]*?\],\n/,
          "controllers: [/// INSERT CONTROLLER HERE],\n",
        );
      }

      // Insert importCode and connectorCode
      indexFileContent = indexFileContent.replace(
        "/// INSERT IMPORT HERE",
        importCode,
      );
      indexFileContent = indexFileContent.replace(
        "/// INSERT CONTROLLER HERE",
        connectorCode,
      );

      const formattedIndexFileContent = await prettier.format(
        indexFileContent,
        {
          parser: "typescript",
        },
      );

      await fs.writeFile(indexFilePath, formattedIndexFileContent);

      console.log("✅ Agentica code created");

      // Add env to .env.local
      const envContent = `\nOPENAI_API_KEY=${openAIKey}\n`;
      await fs.appendFile(path.join(projectPath, ".env.local"), envContent);
      console.log("✅ .env.local updated");
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
    options: IAgenticaStart.IOptions,
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
      options.project
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
    ];

    return questions.filter(
      (question) => question !== null,
    ) as QuestionCollection[];
  };

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
