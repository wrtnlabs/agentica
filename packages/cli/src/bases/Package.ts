import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";

import { PackageManager } from "../utils/types/PackageManager";

export namespace Package {
  export const create = async (input: {
    projectName: string;
    projectPath: string;
  }): Promise<void> => {
    const packageJson = {
      name: input.projectName,
      version: "0.0.1",
      description: "",
      scripts: {
        build: "tsc",
        dev: `ts-node src/index.ts`,
        start: `node dist/index.js`,
      },
    };

    await fs.writeFile(
      path.join(input.projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );
    console.log("✅ package.json created");
  };

  export const installPackage =
    (packageManager: PackageManager) =>
    (input: { projectPath: string; services: string[] }) => {
      const installCmd = (pkg: string) => {
        switch (packageManager) {
          case "npm":
            return `npm install ${pkg}`;
          case "yarn":
            return `yarn add ${pkg}`;
          case "pnpm":
            return `pnpm add ${pkg}`;
          case "bun":
            return `bun add ${pkg}`;
          default:
            /** exhaustive check */
            packageManager satisfies never;

            throw new Error(
              `Unsupported package manager: ${packageManager as unknown as string}`,
            );
        }
      };

      const dependencies = [
        "openai",
        "typia",
        "dotenv",
        "@agentica/core",
        "readline",
        ...input.services.map((s) => `@wrtnlabs/connector-${s}`),
      ];

      const devDependencies = ["ts-node", "typescript"];

      // install existing dependencies
      console.log("🚀 Installing existing dependencies...");
      execSync(`${packageManager} install`, {
        cwd: input.projectPath,
        stdio: "inherit",
      });

      dependencies.forEach((dep) => {
        console.log(`🚀 Installing ${dep}...`);
        execSync(installCmd(dep), { cwd: input.projectPath, stdio: "inherit" });
      });

      devDependencies.forEach((dep) => {
        console.log(`🚀 Installing ${dep}...`);
        execSync(`${installCmd(dep)} -D`, {
          cwd: input.projectPath,
          stdio: "inherit",
        });
      });
    };
}
