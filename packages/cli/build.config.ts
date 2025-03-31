import UnpluginTypia from "@ryoppippi/unplugin-typia/rollup";
import { isCI } from "std-env";
import { defineBuildConfig } from "unbuild";
import pkgJson from "./package.json";

export default defineBuildConfig({
  outDir: "dist",
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
    inlineDependencies: [
      "typia",

      "commander",

      "picocolors",

      // @clack/prompts related
      "sisteransi",
      "@clack/prompts",
      "@clack/core",
    ],
    esbuild: {
      minify: !isCI, // minify only in CI and publish
      target: "es2022", // support for Node.js 18
    },
  },
  sourcemap: !isCI, // sourcemap only in development
});
