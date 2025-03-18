import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      "packages/*/node_modules",
      "**/*.js",
      "**/*.d.ts",
      "packages/*/lib",
      "website",
      "packages/chat",
    ],
  },
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ["tsconfig.eslint.json", "./packages/*/tsconfig.json"],
        projectService: {
          allowDefaultProject: [
            "*.js",
            "*.config.ts",
            "*.config.mjs",
            "packages/*/*.config.{ts,mjs,cjs}",
            "packages/*/build/*.mjs",
            "packages/*/build/*.ts",
          ],
        },
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "no-empty-pattern": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-namespace": "off",
    },
  },
);
