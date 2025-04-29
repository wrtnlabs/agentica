import process from "node:process";

import * as p from "@clack/prompts";
import { Command, Option } from "commander";
import * as picocolors from "picocolors";

import type { StarterTemplate } from "./commands/start";

import { start } from "./commands";
import { START_TEMPLATES } from "./commands/start";

interface CliOptions {
  project?: StarterTemplate;
}

/**
 * The version of the Agentica CLI
 * in production, it will be replaced by unbuild
 */
const VERSION = process.env.AGENTICA_VERSION ?? "0.0.0";

const program = new Command();

program
  .version(VERSION);

// TODO: project option should be template
program
  .command("start")
  .description("Start a new project")
  .addOption(
    new Option(
      "-p, --project <project>",
      "The project type",
    )
      .choices(START_TEMPLATES),
  )
  .action(async (options: CliOptions) => {
    p.intro(`🚀 ${picocolors.blueBright("Agentica")} Setup Wizard`);

    await start({ template: options.project });
  });

/**
 * Run the program
 */
export function run() {
  program.parse(process.argv);
}

export { program };
