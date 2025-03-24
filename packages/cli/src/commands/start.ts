/**
 * @module
 * Start command
 */

import type { SimplifyDeep } from "type-fest";
import type { Service, UnwrapTaggedService } from "../connectors";
import type { PackageManager } from "../packages";
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";
import * as p from "@clack/prompts";
import typia from "typia";
import { generateConnectorsArrayCode, generateServiceImportsCode, getConnectors, insertCodeIntoAgenticaStarter, serviceToConnector } from "../connectors";
import { downloadTemplateAndPlaceInProject, writeEnvKeysToDotEnv } from "../fs";
import { detectPackageManager, installCommand } from "../packages";
import { blueBright, formatWithPrettier, redBright, yellow } from "../utils";

/** supported starter templates */
export type StarterTemplate =
  | "nodejs"
  | "nestjs"
  | "react"
  | "standalone"
  | "nestjs+react";

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
  context: Pick<Context, "packageManager" | "services" | "openAIKey" | "port">;
}

interface InstallDependenciesOptions {
  packageManager: PackageManager;
  projectAbsolutePath: string;
  services: Service[];
}

/** dependencies for the project */
function installServicesAsDependencies({ packageManager, projectAbsolutePath, services }: InstallDependenciesOptions): void {
  // in case service is empty we add dummy package. we use typescript for sure, so we use it.
  const pkg = ([...services.map(service => serviceToConnector(service)), "typescript"]).join(" ");
  const command = installCommand({ packageManager, pkg });

  const s = p.spinner();

  s.start("📦 Package installation in progress...");

  execSync(command, {
    cwd: projectAbsolutePath,
    stdio: [],
  });

  s.stop("✅ Package installation completed");
}

/**
 * Ask questions to the user
 */
async function askQuestions({ template: defaultTemplate }: Pick<StartOptions, "template">): Promise<Context> {
  /** store context for the start command */
  const context: Partial<Context> = { template: defaultTemplate };

  // Ask which package manager to use
  {
    const packageManager = await p.select({
      message: "Which package manager do you want to use?",
      initialValue: detectPackageManager(),
      options: [
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: `yarn (${blueBright("berry is not supported")})` },
        { value: "bun", label: "bun" },
      ] as const satisfies { value: PackageManager; label: string }[],
    });
    if (p.isCancel(packageManager)) {
      process.exit(0);
    }
    p.log.info(`📦 Using ${packageManager} as package manager`);
    context.packageManager = packageManager;
  }

  // Ask for template type
  if (context.template == null) {
    const templateType = await p.select({
      message: "Which project type do you want to start?",
      options: [
        { value: "standalone", label: `Standalone ${blueBright("Agent Server")}` },
        { value: "nodejs", label: `NodeJS ${blueBright("Agent Server")}` },
        { value: "nestjs", label: `NestJS ${blueBright("Agent Server")}` },
        { value: "react", label: `React ${blueBright("Application")}` },
        { value: "nestjs+react", label: `NestJS + React ${blueBright("Agent Server + Client Application")}` },
      ] as const satisfies { value: StarterTemplate; label: string }[],
    });

    if (p.isCancel(templateType)) {
      process.exit(0);
    }

    context.template = templateType;
  }

  // Ask for port
  if (context.template !== "standalone") {
    const port = await p.text({
      message: "Server Port(if project is client app, this port mean ws server port):",
      initialValue: "3000",
      validate(value) {
        if (Number.isNaN(Number.parseInt(value))) {
          return "Port must be an integer";
        }
        return undefined;
      },
    });
    if (p.isCancel(port)) {
      process.exit(0);
    }
    context.port = Number(port);
  }

  // ask if you need connectors
  // if template is react, we don't need connectors
  if (context.template !== "react") {
    const connectors = await getConnectors();
    const sortedConnectors = connectors.sort((a, b) => a.displayName.localeCompare(b.displayName));
    const serviceChoices = sortedConnectors.map(({ displayName, serviceName }) => ({ label: displayName, value: serviceName }));
    const services = await p.multiselect({
      message: "Which connectors do you want to include?",
      options: serviceChoices,
    });
    if (p.isCancel(services)) {
      process.exit(0);
    }
    context.services = services;
  }

  // Ask for openAI key
  {
    const isConfirm = await p.confirm({
      message: "Do you want to use OpenAI?",
    });
    if (p.isCancel(isConfirm)) {
      process.exit(0);
    }

    if (isConfirm) {
      const openAIKey = await p.text({
        message: "Please enter your OPENAI API key:",
      });
      if (p.isCancel(openAIKey)) {
        process.exit(0);
      }
      context.openAIKey = openAIKey;
    }
    else {
      context.openAIKey = null;
    }
  }

  try {
    /** create a unwrapped context because typia doesn't support tagged types */
    type UnwrappedContext = SimplifyDeep<Omit<Context, "services"> & { services: UnwrapTaggedService[] }>;
    typia.assertGuard<UnwrappedContext>(context);
  }
  catch (e) {
    throw new Error(`❌ ${(e as string).toString()}`);
  }

  return context;
}

export async function setupStandAloneProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "standalone",
    project: projectAbsolutePath,
  });
  p.log.success("✅ Template downloaded");

  // modify index file
  const importCode = generateServiceImportsCode(context.services);
  const connectorsCode = generateConnectorsArrayCode(context.services);
  const indexFilePath = join(projectAbsolutePath, "src/index.ts");
  const indexFileContent = await readFile(indexFilePath, "utf-8");
  const updatedIndexFileContent = insertCodeIntoAgenticaStarter({
    content: indexFileContent,
    importCode,
    connectorCode: connectorsCode,
  });
  const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);
  await writeFile(indexFilePath, formattedIndexFileContent);

  // write .env file
  await writeEnvKeysToDotEnv({
    projectPath: projectAbsolutePath,
    apiKeys: [{
      key: "OPENAI_API_KEY",
      value: context.openAIKey ?? "",
    }],
  });
  p.log.success("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

export async function setupNodeJSProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "nodejs",
    project: projectAbsolutePath,
  });
  p.log.success("✅ Template downloaded");

  // modify index file
  const importCode = generateServiceImportsCode(context.services);
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
    importCode,
    connectorCode: connectorsCode,
  });
  const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);
  await writeFile(indexFilePath, formattedIndexFileContent);

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
  p.log.success("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

export async function setupNestJSProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "nestjs",
    project: projectAbsolutePath,
  });
  p.log.success("✅ Template downloaded");

  // modify index file
  const importCode = generateServiceImportsCode(context.services);
  const connectorsCode = generateConnectorsArrayCode(context.services);
  const indexFilePath = join(
    projectAbsolutePath,
    "src/controllers/chat/ChatController.ts",
  );
  const indexFileContent = await readFile(indexFilePath, "utf-8");
  const updatedIndexFileContent = insertCodeIntoAgenticaStarter({
    content: indexFileContent,
    importCode,
    connectorCode: connectorsCode,
  });
  const formattedIndexFileContent = await formatWithPrettier(updatedIndexFileContent);
  await writeFile(indexFilePath, formattedIndexFileContent);

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
  p.log.success("✅ .env created");

  // install dependencies
  installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

export async function setupReactProject({ projectAbsolutePath, context }: SetupProjectOptions): Promise<void> {
  // download and place template in project
  await downloadTemplateAndPlaceInProject({
    template: "react",
    project: projectAbsolutePath,
  });
  p.log.success("✅ Template downloaded");

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
  p.log.success("✅ .env created");

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
  p.intro("Agentica Start Wizard");

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
      // nestjs+rect project is a combination of nestjs and react projects
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

  p.outro(`
🎉 Project ${projectAbsolutePath} created
⚠️  ${yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts
`);
}
