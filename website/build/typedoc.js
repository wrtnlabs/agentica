const cp = require("child_process");
const fs = require("fs");

const main = async () => {
  if (fs.existsSync(`${__dirname}/../typedoc-json`) === false)
    await fs.promises.mkdir(`${__dirname}/../typedoc-json`);
  await fs.promises.writeFile(
    `${__dirname}/../typedoc-json/openapi.json`,
    await fetch("https://samchon.github.io/openapi/api/openapi.json").then(
      (r) => r.text(),
    ),
    "utf8",
  );
  await fs.promises.writeFile(
    `${__dirname}/../typedoc-json/typia.json`,
    await fetch("https://typia.io/api/typia.json").then((r) => r.text()),
    "utf8",
  );

  for (const pack of ["benchmark", "core", "rpc"]) {
    const location = `${__dirname}/../../packages/${pack}`;
    if (fs.existsSync(`${location}/node_modules`) === false)
      cp.execSync("pnpm install", { cwd: location, stdio: "ignore" });
    cp.execSync(
      [
        `npx typedoc --json typedoc-json/${pack}.json`,
        `--options ../packages/${pack}/typedoc.json`,
        `--validation.invalidLink false`,
      ].join(" "),
      {
        cwd: `${__dirname}/..`,
        stdio: "inherit",
      },
    );
  }

  cp.execSync(
    `npx typedoc --entryPointStrategy merge "typedoc-json/*.json" --plugin typedoc-github-theme --theme typedoc-github-theme --out public/api`,
    {
      cwd: `${__dirname}/..`,
      stdio: "inherit",
    },
  );
};
main().catch((error) => {
  console.error(error);
});
