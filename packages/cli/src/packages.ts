/**
 * @module
 * This file contains functions to work with packages.
 */

import process from "node:process";

import type { PackageJson } from "type-fest";

export const PACKAGE_MANAGERS = [
  "npm",
  "yarn",
  "pnpm",
  "bun",
] as const;

/** supported package managers */
export type PackageManager = typeof PACKAGE_MANAGERS[number];

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
  pkg?: string;
}

/**
 * get install command depending on package manager
 */
export function installCommand({ packageManager, pkg }: InstallProps) {
  switch (packageManager) {
    case "npm":
      return `npm install ${pkg ?? ""}`.trim();
    case "yarn":
      return pkg != null ? `yarn add ${pkg}` : "yarn";
    case "pnpm":
      return `pnpm install ${pkg ?? ""}`.trim();
    case "bun":
      return `bun install ${pkg ?? ""}`.trim();
    default:
      /** exhaustive check */
      packageManager satisfies never;

      throw new Error(`Unsupported package manager: ${packageManager as unknown as string}`);
  }
}

/**
 * get run command depending on package manager
 */
export function runCommand({ packageManager, command }: { packageManager: PackageManager; command: string }) {
  switch (packageManager) {
    case "npm":
      return `npm run ${command}`.trim();
    case "yarn":
      return `yarn ${command}`.trim();
    case "pnpm":
      return `pnpm ${command}`.trim();
    case "bun":
      return `bun ${command}`.trim();
    default:
      /** exhaustive check */
      packageManager satisfies never;

      throw new Error(`Unsupported package manager: ${packageManager as unknown as string}`);
  }
}

/**
 * detect package manager from environment
 */
export function detectPackageManager(): PackageManager {
  const agent = process.env.npm_config_user_agent;

  // eslint-disable-next-line ts/switch-exhaustiveness-check
  switch (true) {
    case agent?.startsWith("npm"):
      return "npm";
    case agent?.startsWith("yarn"):
      return "yarn";
    case agent?.startsWith("pnpm"):
      return "pnpm";
    case agent?.startsWith("bun"):
      return "bun";
    default:
      return "npm";
  }
}
