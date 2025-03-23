/**
 * @module
 * This file contains functions to work with packages.
 */

import type { PackageJson } from "type-fest";

/** supported package managers */
export type PackageManager =
  | "npm"
  | "yarn"
  | "pnpm"
  | "bun";

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
export function installCommand({ packageManager, pkg }: InstallProps) {
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
