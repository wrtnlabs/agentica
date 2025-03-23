/**
 * Start command
 *
 * @module
 */

import type { SimplifyDeep, UnwrapTagged } from "type-fest";
import type { Service } from "../connectors";
import type { PackageManager } from "../packages";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import inquirer from "inquirer";
import typia from "typia";
import { generateConnectorsArrayCode, generateServiceImportsCode, getConnectors, insertCodeIntoAgenticaStarter, serviceToConnector } from "../connectors";
import { downloadTemplateAndPlaceInProject, writeEnvKeysToDotEnv } from "../fs";
import { installCommand } from "../packages";
import { blueBright, formatWithPrettier, redBright, yellow } from "../utils";

/** supported starter templates */
// eslint-disable-next-line unused-imports/no-unused-vars
const STARTER_TEMPLATES = [
  "nodejs",
  "nestjs",
  "react",
  "standalone",
  "nestjs+react",
] as const;

/** supported starter templates */
export type StarterTemplate = typeof STARTER_TEMPLATES[number];

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
  port?: number;
}

interface SetupProjectOptions {
  projectAbsolutePath: string;
  context: Context;
}

interface InstallDependenciesOptions {
  packageManager: PackageManager;
  projectAbsolutePath: string;
  services: Service[];
}

/** dependencies for the project */
function installServicesAsDependencies({ packageManager, projectAbsolutePath, services }: InstallDependenciesOptions): void {
  const command = installCommand({ packageManager, pkg: services.map(service => serviceToConnector(service)).join(" ") });
  console.log("📦 Package installation in progress...");
  execSync(command, {
    cwd: projectAbsolutePath,
    stdio: "inherit",
  });
}

/**
 * Ask questions to the user
 */
async function askQuestions({ template: defaultTemplate }: Pick<StartOptions, "template">): Promise<Context> {
  /** store context for the start command */
  const context: Partial<Context> = { template: defaultTemplate };

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
        ],
      },
    ]);
    context.packageManager = packageManager;
  }

  // Ask for template type
  if (context.template == null) {
    const choices = [
      { name: `Standalone ${blueBright("Agent Server")}`, value: "standalone" },
      { name: `NodeJS ${blueBright("Agent Server")}`, value: "nodejs" },
      { name: `NestJS ${blueBright("Agent Server")}`, value: "nestjs" },
      { name: `React ${blueBright("Application")}`, value: "react" },
      { name: `NestJS + React ${blueBright("Agent Server + Client Application")}`, value: "nestjs+react" },
    ] as const satisfies { name: string; value: StarterTemplate }[];

    const { templateType } = await inquirer.prompt<{ templateType: StarterTemplate }>([
      {
        type: "list",
        name: "templateType",
        message: "Which project type do you want to start?",
        choices,
      },
    ]);
    context.template = templateType;
  }

  // Ask for port
  if (context.template !== "standalone") {
    const { port } = await inquirer.prompt<{ port: number }>([
      {
        type: "input",
        name: "port",
        message: "Server Port(if project is client app, this port mean ws server port):",
        default: 3000,
      },
    ]);
    context.port = port;
  }

  // ask if you need connectors
  if (context.template === "react") {
    // React projects don't need connectors
    context.services = [];
  }
  else {
    const connectors = await getConnectors();
    const sortedConnectors = connectors.sort((a, b) => a.displayName.localeCompare(b.displayName));
    const serviceChoices = sortedConnectors.map(({ displayName, serviceName }) => ({ name: displayName, value: serviceName }));
    const { services } = await inquirer.prompt<{ services: Service[] }>([
      {
        type: "checkbox",
        name: "services",
        message: "Which connectors do you want to include?",
        choices: serviceChoices,
      },
    ]);
    context.services = services;
  }

  // Ask for openAI key
  {
    const { openAIKey } = await inquirer.prompt<{ openAIKey: string | null }>([
      {
        type: "input",
        name: "openAIKey",
        message: "Please enter your OPEN_AI_KEY:",
      },
    ]);
    context.openAIKey = openAIKey;
  }

  try {
    type UnwrappedContext = SimplifyDeep<Omit<Context, "services"> & { services: UnwrapTagged<Service>[] }>;
    typia.assertGuard<UnwrappedContext>(context);
  }
  catch (e) {
    throw new Error(`❌ ${(e as string).toString()}`);
  }

  return context;
}

async function setupStandAloneProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "standalone",
    project: projectAbsolutePath,
  });
  console.log("✅ Template downloaded");

  // modify index file
  const imoprtsCode = generateServiceImportsCode(context.services);
  const connectorsCode = generateConnectorsArrayCode(context.services);
  const indexFilePath = join(projectAbsolutePath, "src/index.ts");
  const indexFileContent = await readFile(indexFilePath, "utf-8");
  const updatedIndexFileContent = insertCodeIntoAgenticaStarter({
    content: indexFileContent,
    importCode: imoprtsCode,
    connectorCode: connectorsCode,
  });
  const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);
  await writeFile(indexFilePath, formattedIndexFileContent);
  console.log(`\n🎉 Project ${projectAbsolutePath} created`);

  // write .env file
  await writeEnvKeysToDotEnv({
    projectPath: projectAbsolutePath,
    apiKeys: [{
      key: "OPENAI_API_KEY",
      value: context.openAIKey ?? "",
    }],
  });
  console.log("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

async function setupNodeJSProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "nodejs",
    project: projectAbsolutePath,
  });
  console.log("✅ Template downloaded");

  // modify index file
  const imoprtsCode = generateServiceImportsCode(context.services);
  const connectorsCode = generateConnectorsArrayCode(context.services);
  const indexFilePath = join(projectAbsolutePath, "src/index.ts");
  let indexFileContent = await readFile(indexFilePath, "utf-8");
  indexFileContent = indexFileContent
    .replace(/import \{ BbsArticleService \}.*;\n/g, "")
    .replace(
      /controllers:\s*\[[\s\S]*?\],\n/,
      "controllers: [/// INSERT CONTROLLER HERE],\n",
    );
  const updatedIndexFileContent = insertCodeIntoAgenticaStarter({
    content: indexFileContent,
    importCode: imoprtsCode,
    connectorCode: connectorsCode,
  });
  const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);
  await writeFile(indexFilePath, formattedIndexFileContent);
  console.log(`\n🎉 Project ${projectAbsolutePath} created`);

  // write .env file
  await writeEnvKeysToDotEnv({
    projectPath: projectAbsolutePath,
    apiKeys: [{
      key: "OPENAI_API_KEY",
      value: context.openAIKey ?? "",
    }, {
      key: "PORT",
      value: context.port?.toString() ?? "3000",
    }],
  });
  console.log("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

async function setupNestJSProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "nestjs",
    project: projectAbsolutePath,
  });
  console.log("✅ Template downloaded");

  // modify index file
  const imoprtsCode = generateServiceImportsCode(context.services);
  const connectorsCode = generateConnectorsArrayCode(context.services);
  const indexFilePath = join(
    projectAbsolutePath,
    "src/controllers/chat/ChatController.ts",
  );
  const indexFileContent = await readFile(indexFilePath, "utf-8");
  const updatedIndexFileContent = insertCodeIntoAgenticaStarter({
    content: indexFileContent,
    importCode: imoprtsCode,
    connectorCode: connectorsCode,
  });
  const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);
  await writeFile(indexFilePath, formattedIndexFileContent);
  console.log(`\n🎉 Project ${projectAbsolutePath} created`);

  // write .env file
  await writeEnvKeysToDotEnv({
    projectPath: projectAbsolutePath,
    apiKeys: [{
      key: "OPENAI_API_KEY",
      value: context.openAIKey ?? "",
    }, {
      key: "API_PORT",
      value: context.port?.toString() ?? "3000",
    }],
  });
  console.log("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

async function setupReactProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "react",
    project: projectAbsolutePath,
  });
  console.log("✅ Template downloaded");

  // write .env file
  await writeEnvKeysToDotEnv({
    projectPath: projectAbsolutePath,
    apiKeys: [{
      key: "OPENAI_API_KEY",
      value: context.openAIKey ?? "",
    }, {
      key: "VITE_AGENTICA_WS_URL",
      value: `ws://localhost:${context.port}/chat`,
    }],
  });
  console.log("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

/**
 * Start a new project
 */
export async function start({ project, template }: StartOptions) {
  const projectAbsolutePath = join(process.cwd(), project);

  // Check if project already exists
  if (existsSync(projectAbsolutePath)) {
    console.error(`❌ Project ${redBright(projectAbsolutePath)} already exists`);
    return;
  }

  /** context for the start command */
  const context = await askQuestions({ template });

  switch (context.template) {
    case "standalone":
      await setupStandAloneProject({ projectAbsolutePath, context });
      break;
    case "nodejs":
      await setupNodeJSProject({ projectAbsolutePath, context });
      break;
    case "nestjs":
      await setupNestJSProject({ projectAbsolutePath, context });
      break;
    case "react":
      await setupReactProject({ projectAbsolutePath, context });
      break;
    case "nestjs+react":
      await setupNestJSProject({
        projectAbsolutePath: join(projectAbsolutePath, "server"),
        context,
      });
      await setupReactProject({
        projectAbsolutePath: join(projectAbsolutePath, "client"),
        context,
      });
      break;
    default:
      context.template satisfies never;
      throw new Error(`❌ Template ${context.template as unknown as string} not supported`);
  }

  console.log(
    `\n⚠️  ${yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts`,
  );
}
