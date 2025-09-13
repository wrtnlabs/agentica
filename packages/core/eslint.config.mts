import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  ignores: [
    "eslint.config.mts",
    "lib",
    "vitest.config.mts",
    "prompts/*.md",
  ],
  rules: {
    "node/no-path-concat": "off",
    "no-template-curly-in-string": "off",
    "ts/ban-ts-comment": "off",
    "ts/no-unsafe-member-access": "off",
    "ts/no-unsafe-assignment": "off",
    "ts/no-unsafe-call": "off",
    "ts/no-unsafe-return": "off",
    "eslint-comments/no-unlimited-disable": "off",
  },
});
