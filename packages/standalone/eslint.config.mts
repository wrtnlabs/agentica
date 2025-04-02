import { wrtnlabs } from "@wrtnlabs/eslint-config";
import css from "@eslint/css";

export default wrtnlabs({
  ignores: ["eslint.config.mts", "lib"],
  react: true,
});
