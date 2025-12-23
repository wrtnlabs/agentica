import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  rules: {
    "no-console": "off",
    "ts/no-unsafe-assignment": "off",
    "ts/no-unsafe-member-access": "off",
    "ts/no-unsafe-call": "off",
    "ts/no-unsafe-argument": "off",
    "ts/no-unsafe-return": "off",
  },
  ignores: ["eslint.config.mts", "examples/**"],
});
