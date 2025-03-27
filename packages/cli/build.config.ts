import UnpluginTypia from "@ryoppippi/unplugin-typia/vite";
import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  outDir: "bin",
  entries: ["src/index.ts"],
  declaration: false,
  clean: true,
  hooks: {
    "rollup:options": (_, options) => {
      // plugin should be added to the first
      options.plugins.unshift(UnpluginTypia());
    },
  },
  rollup: {
    inlineDependencies: true,
    output: {
      banner: "#!/usr/bin/env node",
    },
    esbuild: {
      minify: true,
    },
  },
});
