import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export namespace Package {
  export type Manager = "npm" | "yarn" | "pnpm";

  export const create = (input: {
    projectName: string;
    projectPath: string;
  }): void => {
    const packageJson = {
      name: input.projectName,
      version: "0.0.1",
      description: "",
      scripts: {
        build: "tsc",
        dev: `ts-node ${input.projectName}/cli.ts`,
        start: `node ${input.projectName}/cli.js`,
      },
    };

    fs.writeFileSync(
      path.join(input.projectPath, "package.json"),
      JSON.stringify(packageJson, null, 2),
    );
    console.log("✅ package.json created");
  };

  export const installPackage =
    (packageManager: Manager) =>
    (input: { projectPath: string; services: string[] }) => {
      const installCmd = (pkg: string) =>
        packageManager === "npm"
          ? `npm install ${pkg}`
          : packageManager === "yarn"
            ? `yarn add ${pkg}`
            : `pnpm add ${pkg}`;

      const dependencies = [
        "openai",
        "typia",
        "dotenv",
        "@agentica/core",
        "readline",
        ...input.services.map((s) => `@wrtnlabs/connector-${s}`),
      ];

      const devDependencies = ["ts-node", "typescript"];

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
