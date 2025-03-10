#!/usr/bin/env node
import chalk from "chalk";
import { Command } from "commander";

import { AgenticaStart } from "./executable/AgenticaStart";

async function main() {
  const program = new Command();

  program
    .command("start <project>")
    .description("Start a new project")
    .action(async (project: string) => {
      AgenticaStart.execute({ projectName: project });
    });

  console.log("--------------------------------");
  console.log(`   🚀 ${"Agentica"} ${chalk.blueBright("Setup Wizard")}`);
  console.log("--------------------------------");

  program.parse(process.argv);
}

main().catch((exp) => {
  console.error(exp.message);
  process.exit(-1);
});
