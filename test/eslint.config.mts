import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  rules: {
    "no-console": "off",
  },
  ignores: ["eslint.config.mts"],
});
