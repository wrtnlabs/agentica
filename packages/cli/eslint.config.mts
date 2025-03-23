import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  type: "app",
  rules: {
    "no-console": "off", // because this is cli tool, we need to use console
  },
});
