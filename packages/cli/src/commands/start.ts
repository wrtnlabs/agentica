/**
 * @module
 * Start command
 */

import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import process from "node:process";

import type { SimplifyDeep } from "type-fest";

import * as p from "@clack/prompts";
import * as picocolors from "picocolors";
import typia from "typia";

import type { Service, UnwrapTaggedService } from "../connectors";
import type { PackageManager } from "../packages";

import { generateConnectorsArrayCode, generateServiceImportsCode, getConnectors, insertCodeIntoAgenticaStarter, serviceToConnector } from "../connectors";
import { downloadTemplateAndPlaceInProject, writeEnvKeysToDotEnv } from "../fs";
import { detectPackageManager, installCommand, runCommand } from "../packages";
import { execAsync, formatWithPrettier } from "../utils";

/** supported starter templates */
export type StarterTemplate =
  | "nodejs"
  | "nestjs"
  | "react"
  | "standalone"
  | "nestjs+react"
  | "nodejs+react";

/**
 * Start command options
 */
interface StartOptions {
  /** project template */
  template?: Readonly<StarterTemplate>;

}

/** Context for the start command */
interface Context {
  projectAbsolutePath: string;
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
async function installServicesAsDependencies({ packageManager, projectAbsolutePath, services }: InstallDependenciesOptions): Promise<void> {
  /* if no services are selected, undefined is passed to the package manager */
  const pkg = services.length > 0 ? ([...services.map(service => serviceToConnector(service))]).join(" ") : undefined;
  const command = installCommand({ packageManager, pkg });

  const s = p.spinner();

  s.start("📦 Package installation in progress...");

  await execAsync(command, {
    cwd: projectAbsolutePath,
  });

  s.stop("✅ Package installation completed");
}

async function runPrepareCommand({ packageManager, projectAbsolutePath }: Pick<InstallDependenciesOptions, "packageManager" | "projectAbsolutePath">): Promise<void> {
  const prepareCommand = runCommand({ packageManager, command: "prepare" });

  const s = p.spinner();

  s.start("📦 Package installation in progress...");

  await execAsync(prepareCommand, {
    cwd: projectAbsolutePath,
  });

  s.stop("✅ Package installation completed");
}

/**
 * Ask questions to the user
 */
async function askQuestions({ template: defaultTemplate }: Pick<StartOptions, "template">): Promise<Context> {
  /** store context for the start command */
  const context: Partial<Context> = { template: defaultTemplate, services: [] };

  // Ask for project directory
  {
    const projectRelativePath = await p.text({
      message: "Enter the project directory path:",
      placeholder: "./my-agentica-project",
      validate(value) {
        if (value === "") {
          return "Please enter a directory path";
        }
        if (value[0] !== ".") {
          return "Please enter a relative path.";
        }
        if (existsSync(value)) {
          return "Directory already exists";
        }
        return undefined;
      },
    });
    if (p.isCancel(projectRelativePath)) {
      process.exit(0);
    }
    const projectAbsolutePath = join(process.cwd(), projectRelativePath);
    context.projectAbsolutePath = projectAbsolutePath;
  }

  // Ask which package manager to use
  {
    const packageManager = await p.select({
      message: "Which package manager do you want to use?",
      initialValue: detectPackageManager(),
      options: [
        { value: "npm", label: "npm" },
        { value: "pnpm", label: "pnpm" },
        { value: "yarn", label: `yarn (${picocolors.blueBright("berry is not supported")})` },
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
        { value: "standalone", label: `Standalone ${picocolors.blueBright("Agent Server")}` },
        { value: "nodejs", label: `NodeJS ${picocolors.blueBright("Agent Server")}` },
        { value: "nestjs", label: `NestJS ${picocolors.blueBright("Agent Server")}` },
        { value: "react", label: `React ${picocolors.blueBright("Application")}` },
        { value: "nestjs+react", label: `NestJS + React ${picocolors.blueBright("Agent Server + Client Application")}` },
        { value: "nodejs+react", label: `NodeJS + React ${picocolors.blueBright("Agent Server + Client Application")}` },
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
      message: `Which connectors do you want to include? (Press ${picocolors.cyan("<space>")} to select, ${picocolors.cyan("<a>")} to select all, ${picocolors.cyan("<enter>")} to proceed)`,
      options: serviceChoices,
      required: false,
    });
    if (p.isCancel(services)) {
      process.exit(0);
    }
    context.services = services;
  }

  // Ask for openAI key
  {
    const isConfirm = await p.confirm({
      message: "Enter your OpenAI API key?",
      initialValue: false,
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
  await installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });

  // run prepare command
  await runPrepareCommand({
    packageManager: context.packageManager,
    projectAbsolutePath,
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
  const indexFileContent = await readFile(indexFilePath, "utf-8").then((content) => {
    if (context.services.length === 0) {
      return content;
    }

    return content
      .replace(/import \{ BbsArticleService \}.*;\n/g, "")
      .replace(/controllers:\s*\[[\s\S]*?\],\n/, "controllers: [/// INSERT CONTROLLER HERE],\n");
  });

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
  await installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });

  // run prepare command
  await runPrepareCommand({
    packageManager: context.packageManager,
    projectAbsolutePath,
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
  const indexFileContent = await readFile(indexFilePath, "utf-8").then((content) => {
    if (context.services.length === 0) {
      return content;
    }

    return content
      .replace(/import \{ BbsArticleService \}.*;\n/g, "")
      .replace(/controllers:\s*\[[\s\S]*?\],\n/, "controllers: [/// INSERT CONTROLLER HERE],\n");
  });
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
  await installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });

  // run prepare command
  await runPrepareCommand({
    packageManager: context.packageManager,
    projectAbsolutePath,
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
  await installServicesAsDependencies({
    packageManager: context.packageManager,
    projectAbsolutePath,
    services: context.services,
  });
}

/**
 * Start a new project
 */
export async function start({ template }: StartOptions) {
  p.intro("Agentica Start Wizard");

  /** context for the start command */
  const context = await askQuestions({ template });

  const { projectAbsolutePath } = context;

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

    case "nodejs+react":
      await setupNodeJSProject({
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
⚠️  ${picocolors.yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts
`);
}
