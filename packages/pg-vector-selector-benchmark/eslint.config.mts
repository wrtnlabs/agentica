import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  ignores: ["eslint.config.mts", "docs"],
  rules: {
    "no-console": "off",
  },
}, {
  "languageOptions": {
    "parserOptions": {
      "project": "./tsconfig.json",
    },
  },
});
