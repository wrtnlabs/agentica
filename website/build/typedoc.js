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

  cp.execSync("npx typedoc --json website/typedoc-json/agent.json", {
    cwd: `${__dirname}/../..`,
    stdio: "inherit",
  });
  cp.execSync(
    `npx typedoc --entryPointStrategy merge "typedoc-json/*.json" --plugin typedoc-github-theme --theme typedoc-github-theme --out public/api`,
    {
      cwd: `${__dirname}/..`,
      stdio: "inherit",
    },
  );
  await fs.promises.writeFile(
    `${__dirname}/../public/api/agent.json`,
    await fs.promises.readFile(
      `${__dirname}/../typedoc-json/agent.json`,
      "utf8",
    ),
    "utf8",
  );
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
