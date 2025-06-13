import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  rules: {
    "no-console": "off",
    "ts/no-unsafe-assignment": "off",
  },
  ignores: ["eslint.config.mts", "examples/**"],
});
