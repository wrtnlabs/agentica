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
