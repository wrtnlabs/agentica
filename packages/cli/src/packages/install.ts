import type { PackageManager } from "./consts";

interface InstallProps {
  packageManager: PackageManager;
  pkg: string;
}

export const install = ({ packageManager, pkg }: InstallProps) => {
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
