import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  ignores: ["eslint.config.mts","lib", "vitest.config.mts"],
  rules: {
    "node/no-path-concat": "off",
    "ts/ban-ts-comment": "off",
    "ts/no-unsafe-member-access": "off",
    "ts/no-unsafe-assignment": "off",
    "ts/no-unsafe-return": "off",
  }
});
