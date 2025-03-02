#!/usr/bin/env node
import cp from "child_process";
import fs from "fs";

const USAGE = `Wrong command has been detected. Use like below:

npx agentica <type> <directory>

  1. npx agentica start <directory>
  2. npx agentica backend <directory>
  3. npx agentica client <directory>
`;

const halt = (desc: string): never => {
  console.error(desc);
  process.exit(-1);
};

const clone = async (type: string, directory: string): Promise<void> => {
  const execute = (command: string): void => {
    console.log(`\n$ ${command}`);
    cp.execSync(command, { stdio: "inherit" });
  };

  // COPY PROJECTS
  execute(
    `git clone https://github.com/wrtnlabs/agentica-template-${type} ${directory}`,
  );
  console.log(`cd "${directory}"`);
  process.chdir(directory);

  // INSTALL DEPENDENCIES
  execute("npm install");

  // BUILD TYPESCRIPT
  execute("npm run build");

  // DO TEST
  execute("npm run test");

  // REMOVE .GIT DIRECTORY
  cp.execSync("npx rimraf .git");
  cp.execSync("npx rimraf .github/dependabot.yml");
};

const main = async (): Promise<void> => {
  const [_v0, _v1, type, directory] = process.argv;
  if (
    ["start", "backend", "client", "standalone"].includes(type) === false ||
    directory === undefined
  )
    halt(USAGE);
  else if (fs.existsSync(directory) === true)
    halt("The target directory already exists.");
  await clone(type, directory);
};
main().catch((exp) => {
  console.log(exp.message);
  process.exit(-1);
});
