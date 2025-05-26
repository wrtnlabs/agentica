import process from "node:process";

import * as p from "@clack/prompts";
import { Command, Option } from "commander";
import * as picocolors from "picocolors";

import { version } from "../package.json";

import type { StarterTemplate } from "./commands/start";

import { start } from "./commands";
import { START_TEMPLATES } from "./commands/start";

interface CliOptions {
  project?: StarterTemplate;
}

const program = new Command();

program
  .version(version);

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
