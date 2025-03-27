import UnpluginTypia from "@ryoppippi/unplugin-typia/rollup";
import { defineBuildConfig } from "unbuild";
import pkgJson from "./package.json";

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
  replace: {
    "process.env.AGENTICA_VERSION": JSON.stringify(pkgJson.version), // replace version from package.json on build
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
