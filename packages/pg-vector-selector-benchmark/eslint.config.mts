import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  ignores: ["eslint.config.mts"],
  rules: {
    "no-console": "off",
  },
});
