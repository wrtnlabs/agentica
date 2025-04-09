import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    UnpluginTypia({ cache: false }),
  ],
  test: {
    globals: true,
    exclude: ["**/node_modules/**", "**/dist/**", "**/prompts/**", "**/build/**", "**/examples/**", "**/lib/**"],
  },
});
