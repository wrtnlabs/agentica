import { Command } from "commander";

import { AgenticaStart } from "./executable/AgenticaStart";
import { IAgenticaStart } from "./structures/IAgenticaStart";
import { redBright, blueBright } from './utils/styleText';

async function main() {
  const program = new Command();

  program
    .command("start <directory>")
    .description("Start a new project")
    .option(
      "-p, --project [nodejs|nestjs|react|standalone]",
      "The project type",
    )
    .action(async (directory: string, options: IAgenticaStart.IOptions) => {
      if ((options.project as any) === true) {
        console.error(
          `\n❌ The value of ${redBright("--project")} is required`,
        );
        return;
      }

      AgenticaStart.execute({ projectName: directory, options });
    });

  console.log("--------------------------------");
  console.log(`   🚀 ${"Agentica"} ${blueBright("Setup Wizard")}`);
  console.log("--------------------------------");

  program.parse(process.argv);
}

main().catch((exp) => {
  console.error(exp.message);
  process.exit(-1);
});
