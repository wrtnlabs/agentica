import type { PackageJson } from "type-fest";

export const dependencies = [
  "openai",
  "typia",
  "dotenv",
  "@agentica/core",
  "readline",
] as const;

export const devDependencies = [
  "ts-node",
  "typescript"
] as const;

export const packageManagers = [
  "npm",
  "yarn",
  "pnpm",
  "bun",
] as const;

export type PackageManager = typeof packageManagers[number];

export const basePackageJson = {
  version: "0.0.1",
  description: "",
  scripts: {
    prepare: "ts-patch install",
    build: "tsc",
    dev: `ts-node src/index.ts`,
    start: `node dist/index.js`,
  },
} as const satisfies PackageJson;

interface InstallProps {
  packageManager: PackageManager;
  pkg: string;
}

/**
  * get install command depending on package manager
  */
export const installCommand = ({ packageManager, pkg }: InstallProps) => {
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

      throw new Error(`Unsupported package manager: ${packageManager as unknown as string}`);
  }
}
