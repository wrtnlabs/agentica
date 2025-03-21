/**
* Start command
*
* @module
*/

import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import inquirer from "inquirer";
import { type Connector, getConnectors } from "../connectors";
import { PackageManager } from "../packages";
import { redBright, blueBright, yellow } from "../utils";
import typia from "typia";

/** supported starter templates */
const STARTER_TEMPLATES = [
  "nodejs",
  "nestjs",
  "react",
  "standalone"
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
  services: Connector[];
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
      const { templateType } = await inquirer.prompt<{ templateType: StarterTemplate }>([
        {
          type: "list",
          name: "templateType",
          message: "Which project type do you want to start?",
          choices: STARTER_TEMPLATES,
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
      const serviceChoices = sortedConnectors.map(({displayName, packageName}) => ({name: displayName, value: packageName}));
      const { services } = await inquirer.prompt<{ services: Connector[] }>([
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

  // install and setup the project


  console.log(`\n🎉 Project ${project} created`);
  console.log(
    `\n⚠️  ${yellow("Note:")} Please implement constructor values for each controller generated in agent.ts or index.ts`,
  );
}
