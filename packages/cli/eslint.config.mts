import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  type: "app",
  test: true,
  ignores: ["eslint.config.mts", "bin"],
});
