import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  typescript: false,
  ignores: [
    ".wiki",
    "packages",
    "test",
    "website",
    "benchmark",
    "bump.config.ts",
  ],
});
