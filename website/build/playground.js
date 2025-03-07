const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const CHAT = `${__dirname}/../../packages/chat`;
const PUBLIC = `${__dirname}/../public/playground`;

const copy = async (src, dest) => {
  try {
    if (fs.existsSync(dest)) await fs.promises.rm(dest, { recursive: true });
  } catch {}
  try {
    await fs.promises.mkdir(dest);
  } catch {}

  const directory = await fs.promises.readdir(src);
  for (const file of directory) {
    const x = path.join(src, file);
    const y = path.join(dest, file);
    const stat = await fs.promises.stat(x);
    if (stat.isDirectory()) await copy(x, y);
    else await fs.promises.writeFile(y, await fs.promises.readFile(x));
  }
};

const main = async () => {
  cp.execSync("npm run build:static", {
    stdio: "inherit",
    cwd: CHAT,
  });
  await copy(`${CHAT}/dist`, PUBLIC);
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
