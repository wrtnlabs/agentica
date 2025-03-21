import { Command } from "commander";
import { start, StarterTemplate } from "./commands/start";
import { IAgenticaStart } from "./types";
import { redBright, blueBright } from "./utils";
import typia from "typia";

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

      /** check valid project type */
      try {
        typia.assertGuard<StarterTemplate|undefined>(options.project);
      } catch (e) {
        console.error(
          `\n❌ The value of ${redBright("--project")} is invalid`,
        );
        return;
      }

      start({ project: directory, template: options.project });
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
