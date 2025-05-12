import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  ignores: ["eslint.config.mts","lib", "vitest.config.mts"],
  rules: {
    "ts/ban-ts-comment": "off",
  }
});
