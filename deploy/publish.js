const cp = require("child_process");
const fs = require("fs");

const { loadPackages } = require("./internal/loadPackages");

const build = ({ version, tag, name }) => {
  console.log("=========================================");
  console.log(` Publish @agentica/${name}`);
  console.log("=========================================");

  // BUILD
  const location = `${__dirname}/../packages/${name}`;
  const execute = (command) =>
    cp.execSync(command, {
      cwd: location,
      stdio: "inherit",
    });
  execute("pnpm install");
  execute("pnpm run build");

  // PACKAGE MAIN INFO
  const load = () => fs.readFileSync(`${location}/package.json`, "utf8");
  const original = JSON.parse(load());
  const pack = JSON.parse(load());

  delete pack.private;
  pack.version = version;
  if (pack.main === "src/index.ts") {
    pack.main = "lib/index.js";
    pack.module = "lib/index.mjs";
    pack.typings = "lib/index.d.ts";
  }

  // DEPENDENCIES
  for (const obj of [pack.dependencies ?? {}, pack.devDependencies ?? {}])
    for (const key of Object.keys(obj))
      if (key.startsWith("@agentica/")) obj[key] = `^${version}`;

  // DEPLOY
  try {
    fs.writeFileSync(
      `${location}/package.json`,
      JSON.stringify(pack, null, 2),
      "utf8",
    );
    execute(
      `npm publish --tag ${tag} --access public ${tag === "latest" ? "--provance" : ""}`,
    );
  } catch (exp) {
    throw exp;
  } finally {
    fs.writeFileSync(
      `${location}/package.json`,
      JSON.stringify(original, null, 2),
      "utf8",
    );
  }
};

const main = () => {
  const { version } = JSON.parse(
    fs.readFileSync(`${__dirname}/../package.json`, "utf8"),
  );
  const dev = version.includes("-dev.");
  const tag = (() => {
    const index = process.argv.indexOf("--tag");
    const value = index === -1 ? undefined : process.argv[index + 1];
    return value ?? "latest";
  })();
  if (dev === undefined)
    throw new Error("Invalid package version. Please check the package.json.");
  else if (tag === "next" && dev === false)
    throw new Error(`${tag} tag can only be used for dev versions.`);
  else if (tag === "latest" && dev === true)
    throw new Error(`latest tag can only be used for non-dev versions.`);

  cp.execSync("pnpm install", {
    cwd: `${__dirname}/../`,
    stdio: "inherit",
  });
  loadPackages().forEach((name) =>
    build({
      name,
      version,
      tag,
    }),
  );
};
main();
