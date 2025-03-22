/**
* Start command
*
* @module
*/

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import inquirer from "inquirer";
import { type Service, generateServiceImportsCode, generateConnectorsArrayCode, getConnectors, insertCodeIntoAgenticaStarter } from "../connectors";
import { PackageManager } from "../packages";
import { redBright, blueBright, yellow, formatWithPrettier } from "../utils";
import typia from "typia";
import { downloadTemplateAndPlaceInProject, writeEnvKeysToDotEnv } from "../fs";

/** supported starter templates */
const STARTER_TEMPLATES = [
  "nodejs",
  "nestjs",
  "react",
  "standalone"
] as const;

/** supported starter templates */
export type StarterTemplate = typeof STARTER_TEMPLATES[number];

/** dependencies for each template */
const dependencies = [
  "openai",
  "typia",
  "dotenv",
  "@agentica/core",
  "readline",
] as const;

/** dev dependencies for each template */
const devDependencies = [
  "ts-node",
  "typescript"
] as const;

/**
* Start command options
*/
interface StartOptions {
  /** project template */
  template?: Readonly<StarterTemplate>;

  /** project relative directory */
  project: Readonly<string>;
}

/** Context for the start command */
interface Context {
  packageManager: PackageManager;
  template: StarterTemplate;
  services: Service[];
  openAIKey: string | null;
}

/**
* Start a new project
*
* @param options - start options
*/
export async function start({ project, template }: StartOptions) {
  /** store context for the start command */
  const context: Partial<Context> = {};

  const projectAbsolutePath = join(process.cwd(), project);

  // Check if project already exists
  if (existsSync(projectAbsolutePath)) {
    console.error(`❌ Project ${redBright(projectAbsolutePath)} already exists`);
    return;
  }

  // Ask which package manager to use
{ 
    const { packageManager } = await inquirer.prompt<{ packageManager: PackageManager }>([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager do you want to use?",
        choices: [
          "npm",
          "pnpm",
          {
            name: `yarn (berry ${blueBright("is not supported")})`,
            value: "yarn",
          },
          "bun",
        ]
      }
    ]);
    context.packageManager = packageManager
  }

  // Ask for template type
{
    if (template != null) {
      context.template = template;
    }else{
      const choices = {
        standalone: `Standalone ${blueBright("Agent Server")}`,
        nodejs: `NodeJS ${blueBright("Agent Server")}`,
        nestjs: `NestJS ${blueBright("Agent Server")}`,
        react: `React ${blueBright("Application")}`,
      } as const satisfies Record<StarterTemplate, string>;

      const { templateType } = await inquirer.prompt<{ templateType: StarterTemplate }>([
        {
          type: "list",
          name: "templateType",
          message: "Which project type do you want to start?",
          choices,
        }
      ]);
      context.template = templateType;
    }
  }


  // ask if you need connectors
{
    if(template == 'react'){
      // React projects don't need connectors
      context.services = [ ];
    }else{
      const connectors = await getConnectors();
      const sortedConnectors = connectors.sort((a, b) => a.displayName.localeCompare(b.displayName));
      const serviceChoices = sortedConnectors.map(({displayName, serviceName}) => ({name: displayName, value: serviceName}));
      const { services } = await inquirer.prompt<{ services: Service[] }>([
        {
          type: "checkbox",
          name: "services",
          message: "Which connectors do you want to include?",
          choices: serviceChoices
        }
      ]);
      context.services = services;
    }
  }

  // Ask for openAI key
{
    const { openAIKey } = await inquirer.prompt<{ openAIKey: string | null }>([
      {
        type: "input",
        name: "openAIKey",
        message: "Please enter your OPEN_AI_KEY:"
      }
    ]);
    context.openAIKey = openAIKey;
  }

  try {
    typia.assertGuard<Context>(context);
  } catch (e) {
    throw new Error(`❌ ${(e as string).toString()}`);
  }

{
    // download and place template in project
    await downloadTemplateAndPlaceInProject({
      template: context.template,
      project: projectAbsolutePath
    })
    console.log("✅ Template downloaded");
  }

{
    const imoprtsCode = generateServiceImportsCode(context.services);
    const connectorsCode = generateConnectorsArrayCode(context.services);

    // setup project
    let indexFilePath: string | undefined;
    let indexFileContent: string | undefined;
    if(context.template === 'standalone'){
      indexFilePath = join(projectAbsolutePath, "src/index.ts");
      indexFileContent = await readFile(indexFilePath, "utf-8");
    } else if(context.template === 'nodejs'){
      indexFilePath = join(projectAbsolutePath, "src/index.ts");
      indexFileContent = await readFile(indexFilePath, "utf-8")
      indexFileContent = indexFileContent
        .replace(/import { BbsArticleService }.*;\n/g, "")
        .replace(
          /controllers:\s*\[[\s\S]*?\],\n/,
          "controllers: [/// INSERT CONTROLLER HERE],\n",
        );
    }else if(context.template === 'nestjs'){
      indexFilePath = join(
        projectAbsolutePath,
        "src/controllers/chat/ChatController.ts",
      );
      indexFileContent = await readFile(indexFilePath, "utf-8");
    }else if(context.template === 'react'){
      // react projects don't need to modify index file
    }else{
      context.template satisfies never;
      throw new Error(`❌ Invalid template: ${context.template}`);
    }

    if(indexFilePath != null && indexFileContent != null){
      // insert code into index file
      const updatedIndexFileContent = insertCodeIntoAgenticaStarter({
        content: indexFileContent,
        importCode: imoprtsCode,
        connectorCode: connectorsCode
      });

      // format with prettier if possible
      const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);

      // write index file
      await writeFile(indexFilePath, formattedIndexFileContent);

      console.log(`\n🎉 Project ${project} created`);
    }
  }

{
    // write .env file
    await writeEnvKeysToDotEnv({
      projectPath: projectAbsolutePath,
      apiKeys: [{
        key: "OPENAI_API_KEY",
        value: context.openAIKey ?? "",
      }]
    });
    console.log("✅ .env created");
  }

  console.log(
    `\n⚠️  ${yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts`,
  );
}
