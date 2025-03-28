import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  typescript: false,
  ignores: [
    // monorepo
    "packages",
    "test",
    "website",
    // pnpm store for `act` library(https://github.com/nektos/act)
    ".pnpm-store",
  ],
});
