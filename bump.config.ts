import { readFileSync } from "node:fs";

import { defineConfig } from "bumpp";
import yaml from "js-yaml";

const workspaceConfig = yaml.load(readFileSync("pnpm-workspace.yaml", "utf8")) as {
  packages: string[];
};

export default defineConfig({
  preid: "dev",
  recursive: true,
  files: workspaceConfig.packages.map((pack) => `${pack}/README.md`),
});
