import fs from "node:fs/promises";
import path from "node:path";
import { downloadTemplate } from "giget";

import { Connector } from "../bases/Connector";
import { Package } from "../bases/Package";
import { IAgenticaStartOption } from "../structures/IAgenticaStartOption";
import { blueBright } from "../utils/styleText";
import { PackageManager } from "../utils/types/PackageManager";
import { ProjectOptionValue } from "../utils/types/ProjectOption";

export namespace AgenticaStarter {
  export const execute =
    (option: ProjectOptionValue) =>
    (packageManager: PackageManager) =>
    async (input: IAgenticaStartOption.IProject) => {
      const runner = PROJECT[option].runner;
      if (!runner) {
        throw new Error(`Not supported project type: ${option}`);
      }

      // Run Agentica CLI
      const { projectPaths } = await runner(input);

      // Run package installation
      console.log("📦 Package installation in progress...");

      projectPaths.forEach((p) => {
        process.chdir(p);

        Package.installPackage(packageManager)({
          projectPath: p,
          services: input.services,
        });
      });
    };

  export const PROJECT = {
    standalone: {
      title: `Standalone ${blueBright("Application")}`,
      key: "standalone",
      runner: async (
        input: IAgenticaStartOption.IProject,
      ): Promise<{ projectPaths: string[] }> => {
        await bootstrap("standalone")(input)(async () => {
          const indexFilePath = path.join(input.projectPath, "src/index.ts");
          const indexFileContent = await fs.readFile(indexFilePath, "utf-8");
          return { indexFilePath, indexFileContent };
        });

        return { projectPaths: [input.projectPath] };
      },
    },

    nodejs: {
      title: `NodeJS ${blueBright("Agent Server")}`,
      key: "nodejs",
      runner: async (
        input: IAgenticaStartOption.IProject,
      ): Promise<{ projectPaths: string[] }> => {
        await bootstrap("nodejs")(input)(async () => {
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
        });

        return { projectPaths: [input.projectPath] };
      },
    },
    nestjs: {
      title: `NestJS ${blueBright("Agent Server")}`,
      key: "nestjs",
      runner: async (
        input: IAgenticaStartOption.IProject,
      ): Promise<{ projectPaths: string[] }> => {
        await bootstrap("nestjs")(input)(async () => {
          const indexFilePath = path.join(
            input.projectPath,
            "src/controllers/chat/ChatController.ts",
          );

          const indexFileContent = await fs.readFile(indexFilePath, "utf-8");

          return { indexFilePath, indexFileContent };
        });

        return { projectPaths: [input.projectPath] };
      },
    },
    react: {
      title: `React ${blueBright("Client Application")}`,
      key: "react",
      runner: async (
        input: IAgenticaStartOption.IProject,
      ): Promise<{ projectPaths: string[] }> => {
        await writeTemplate("react", input.projectName);

        await setEnvFiles("react")(input);

        return { projectPaths: [input.projectPath] };
      },
    },
    "nestjs+react": {
      title: `NestJS + React ${blueBright("Agent Server + Client Application")}`,
      key: "nestjs+react",
      runner: async (
        input: IAgenticaStartOption.IProject,
      ): Promise<{ projectPaths: string[] }> => {
        await bootstrap("nestjs")({
          ...input,
          projectPath: `${input.projectPath}/server`,
          projectName: `${input.projectName}/server`,
        })(async () => {
          const indexFilePath = path.join(
            input.projectPath,
            "server",
            "src/controllers/chat/ChatController.ts",
          );

          const indexFileContent = await fs.readFile(indexFilePath, "utf-8");
          return { indexFilePath, indexFileContent };
        });

        await writeTemplate("react", `${input.projectName}/client`);

        await setEnvFiles("react")({
          ...input,
          projectPath: `${input.projectPath}/client`,
          projectName: `${input.projectName}/client`,
        });

        return {
          projectPaths: [
            `${input.projectPath}/server`,
            `${input.projectPath}/client`,
          ],
        };
      },
    },
  } as const;

  const bootstrap =
    // @TODO Categorize bootstrap as 'multiple projects' or 'single project'.
    (option: Exclude<ProjectOptionValue, "react" | "nestjs+react">) =>
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
        await setEnvFiles(option)(input);
      };

  const writeTypescriptFile = async (props: {
    filePath: string;
    taskName: string;
    content: string;
  }): Promise<void> => {
    /** prettier is not in the dependencies */
    const formattedFileContent = await import("prettier")
      .then((prettier) =>
        prettier.format(props.content, {
          parser: "typescript",
        }),
      )
      .catch(() => props.content);

    await fs.writeFile(props.filePath, formattedFileContent);
    console.log(`✅ ${props.taskName} created`);
  };
  /**
   * Set project .env files
   */
  const setEnvFiles =
    (projectType: Exclude<ProjectOptionValue, "nestjs+react">) =>
    async (input: IAgenticaStartOption.IProject): Promise<void> => {
      // Create .env file
      const envPath = path.join(input.projectPath, ".env");

      const ENV = {
        standalone: {
          OPENAI_API_KEY: input.openAIKey,
        },
        nodejs: {
          OPENAI_API_KEY: input.openAIKey,
          PORT: input.port,
        },
        nestjs: {
          OPENAI_API_KEY: input.openAIKey,
          API_PORT: input.port,
        },
        react: {
          VITE_AGENTICA_WS_URL: `ws://localhost:${input.port}/chat`,
        },
      } as const satisfies Record<
        Exclude<ProjectOptionValue, "nestjs+react">,
        Record<string, string>
      >;

      const envContent = Object.entries(ENV[projectType])
        .map(([key, value]) => `${key}=${value}`)
        .join("\n");

      try {
        await fs.access(envPath);
        await fs.appendFile(envPath, envContent);
        console.log("✅ .env updated");
      } catch (err) {
        await fs.writeFile(envPath, envContent);
        console.log("✅ .env created");
      }
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

    console.log("✅ Template downloaded");

    // Some templates may not have .github/dependabot.yml
    const dependabotFilePath = path.join(directory, ".github/dependabot.yml");
    if (
      await fs
        .access(dependabotFilePath)
        .then(() => true)
        .catch(() => false)
    ) {
      await fs.rm(dependabotFilePath);
    }
  };
}
