import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  rules: {
    "ts/unbound-method": ["error", { ignoreStatic: true }],
  },
});
