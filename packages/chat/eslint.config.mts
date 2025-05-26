import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  ignores: ["eslint.config.mts", "vite.config.ts", "vite-env.d.ts"],
  rules: {
    "no-alert": "off",
    "no-console": "off",
    "ts/no-unsafe-member-access": "off",
  }
});