import type { StarterTemplate } from "./commands/start";

import process from "node:process";
import { Command } from "commander";
import typia from "typia";
import { start } from "./commands/start";
import { blueBright, redBright } from "./utils";

interface CliOptions {
  project?: StarterTemplate;
}

const program = new Command();

// TODO: project option should be template
program
  .command("start <directory>")
  .description("Start a new project")
  .option(
    "-p, --project [nodejs|nestjs|react|nestjs+react|standalone]",
    "The project type",
  )
  .action(async (directory: string, options: CliOptions) => {
    if ((options.project as any) === true) {
      console.error(
        `\n❌ The value of ${redBright("--project")} is required`,
      );
      return;
    }

    /** check valid project type */
    if (!typia.is<StarterTemplate | undefined>(options.project)) {
      console.error(
        `\n❌ The value of ${redBright("--project")} is invalid`,
      );
      return;
    }

    await start({ project: directory, template: options.project });
  });

console.log("--------------------------------");
console.log(`   🚀 ${"Agentica"} ${blueBright("Setup Wizard")}`);
console.log("--------------------------------");

program.parse(process.argv);
