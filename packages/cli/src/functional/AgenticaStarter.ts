import fs from "fs/promises";
import { downloadTemplate } from "giget";
import path from "node:path";

import { Connector } from "../bases/Connector";
import { Package } from "../bases/Package";
import { Tsconfig } from "../bases/Tsconfig";
import { IAgenticaStartOption } from "../structures/IAgenticaStartOption";
import { createProjectDirectory } from "../utils/createProjectDirectory";
import { blueBright } from "../utils/styleText";
import { ProjectOptionValue } from "../utils/types/ProjectOption";

export namespace AgenticaStarter {
  export const execute = (option: ProjectOptionValue) => {
    const runner = PROJECT[option].runner;
    if (!runner) {
      throw new Error(`Not supported project type: ${option}`);
    }

    return runner;
  };

  export const PROJECT = {
    standalone: {
      title: `Standalone ${blueBright("Application")}`,
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
      title: `NodeJS ${blueBright("Agent Server")}`,
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
      title: `NestJS ${blueBright("Agent Server")}`,
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
      title: `React ${blueBright("Client Application")} (Currently not supported)`,
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

    console.log("✅ Template downloaded");

    // REMOVE .GIT DIRECTORY
    await fs.rm(path.join(directory, ".git"), { recursive: true });
    await fs.rm(path.join(directory, ".github/dependabot.yml"));
  };
}
