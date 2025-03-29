import type { StarterTemplate } from "./commands/start";

import process from "node:process";
import * as p from "@clack/prompts";
import { Command } from "commander";
import * as picocolors from "picocolors";
import typia from "typia";
import { start } from "./commands";

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
  .option(
    "-p, --project [nodejs|nestjs|react|nestjs+react|standalone]",
    "The project type",
  )
  .action(async (options: CliOptions) => {
    if ((options.project as any) === true) {
      p.log.error(
        `\n❌ The value of ${picocolors.redBright("--project")} is required`,
      );
      return;
    }

    /** check valid project type */
    if (!typia.is<StarterTemplate | undefined>(options.project)) {
      p.log.error(
        `\n❌ The value of ${picocolors.redBright("--project")} is invalid`,
      );
      return;
    }

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
