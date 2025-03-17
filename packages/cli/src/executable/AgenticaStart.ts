import chalk from "chalk";
import cp from "child_process";
import fs from "fs/promises";
import { downloadTemplate } from "giget";
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
    const config = {
      ...(await inquirer.prompt<{
        projectType: ProjectOptionValue;
        services: string[];
        packageManager: PackageManager;
        openAIKey: string;
      }>(questions)),
      ...(options.project ? { projectType: options.project } : {}),
    };

    const validAnswers = typia.assert(config);
    const { packageManager, openAIKey, projectType, services } = validAnswers;

    await AgenticaStarter.execute(projectType)({
      projectName,
      projectPath,
      openAIKey,
      services,
    });

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
            choices: Object.values(AgenticaStarter.PROJECT).map((project) => ({
              name: project.title,
              value: project.key,
            })),
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
}

/**
 * Methods for Agentica start options.
 */
namespace AgenticaStarter {
  export const execute = (option: ProjectOptionValue) => {
    const runner = PROJECT[option].runner;
    if (!runner) {
      throw new Error(`Not supported project type: ${option}`);
    }

    return runner;
  };

  export const PROJECT = {
    standalone: {
      title: `Standalone ${chalk.blueBright("Application")}`,
      key: "standalone",
      runner: async (input: IAgenticaStartOption.IProject): Promise<void> => {
        // Create project directory
        createProjectDirectory({ projectPath: input.projectPath });

        // Create package.json (without dependencies)
        await Promise.all([
          // create package.json
          Package.create({
            projectName: input.projectName,
            projectPath: input.projectPath,
          }),
          // create tsconfig.json
          Tsconfig.create({ projectPath: input.projectPath }),
        ]);

        await fs.mkdir(path.join(input.projectPath, "src"), {
          recursive: false,
        });

        // Create Agentica code
        const agenticaCode = Connector.createAll({ services: input.services });

        await writeTypescriptFile({
          filePath: path.join(input.projectPath, "src/agent.ts"),
          taskName: "Agentica code",
          content: agenticaCode,
        });
        await setEnvFiles(input);
      },
    },

    nodejs: {
      title: `NodeJS ${chalk.blueBright("Agent Server")}`,
      key: "nodejs",
      runner: async (input: IAgenticaStartOption.IProject): Promise<void> =>
        nonStandalone("nodejs")(input)(async () => {
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

          return { indexFilePath, indexFileContent };
        }),
    },
    nestjs: {
      title: `NestJS ${chalk.blueBright("Agent Server")}`,
      key: "nestjs",
      runner: async (input: IAgenticaStartOption.IProject): Promise<void> =>
        nonStandalone("nestjs")(input)(async () => {
          const indexFilePath = path.join(
            input.projectPath,
            "src/controllers/chat/ChatController.ts",
          );

          const indexFileContent = await fs.readFile(indexFilePath, "utf-8");
          return { indexFilePath, indexFileContent };
        }),
    },
    react: {
      title: `React ${chalk.blueBright("Client Application")} (Currently not supported)`,
      key: "react",
      runner: undefined,
    },
  } as const;

  const nonStandalone =
    (option: "nodejs" | "nestjs") =>
    (input: IAgenticaStartOption.IProject) =>
    async (
      getIndexFileInfo: () => Promise<{
        indexFilePath: string;
        indexFileContent: string;
      }>,
    ) => {
      await writeTemplate(option, input.projectName);

      // Create Agentica code
      const importCode = Connector.create("import")({
        services: input.services,
      });

      const connectorCode = Connector.create("connector")({
        services: input.services,
      });

      const { indexFilePath, indexFileContent } = await getIndexFileInfo();

      // Insert importCode and connectorCode
      const agenticaCode = indexFileContent
        .replace("/// INSERT IMPORT HERE", importCode)
        .replace("/// INSERT CONTROLLER HERE", connectorCode);

      await writeTypescriptFile({
        filePath: indexFilePath,
        taskName: "Agentica code",
        content: agenticaCode,
      });
      await setEnvFiles(input);
    };

  const writeTypescriptFile = async (props: {
    filePath: string;
    taskName: string;
    content: string;
  }): Promise<void> => {
    const formattedFileContent = await prettier.format(props.content, {
      parser: "typescript",
    });

    await fs.writeFile(props.filePath, formattedFileContent);
    console.log(`✅ ${props.taskName} created`);
  };
  /**
   * Set project .env files
   */
  const setEnvFiles = async (
    input: IAgenticaStartOption.IProject,
  ): Promise<void> => {
    // Create .env file
    const envContent = `OPENAI_API_KEY=${input.openAIKey}\n`;
    await fs.writeFile(path.join(input.projectPath, ".env"), envContent);
    console.log("✅ .env created");
  };
  /**
   * Git Clone from template repository.
   */
  export const writeTemplate = async (
    type: ProjectOptionValue,
    directory: string,
  ): Promise<void> => {
    // COPY PROJECTS
    await downloadTemplate(`github:wrtnlabs/agentica.template.${type}`, {
      dir: directory,
    });
    process.chdir(directory);

    console.log("✅ Template downloaded");

    // REMOVE .GIT DIRECTORY
    cp.execSync("npx rimraf .git");
    cp.execSync("npx rimraf .github/dependabot.yml");
  };
}
