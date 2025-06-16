import UnpluginTypia from "@ryoppippi/unplugin-typia/rollup";
import { isCI } from "std-env";
import { defineBuildConfig } from "unbuild";

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
  rollup: {
    inlineDependencies: [
      "typia",

      "commander",

      "picocolors",

      "nano-spawn",

      // indent
      "indent-string",
      "detect-indent",

      // @clack/prompts related
      "sisteransi",
      "@clack/prompts",
      "@clack/core",

      // giget
      "@bluwy/giget-core",

      // tar (dependency of giget)
      "tar",
      "fs-minipass",
      "yallist",
      "minizlib",
      "minipass",
      "mkdirp",
      "chownr",
    ],
    esbuild: {
      minify: isCI, // minify only in CI and publish
      target: "es2022", // support for Node.js 18
    },
  },
  sourcemap: !isCI, // sourcemap only in CI and publish
});
