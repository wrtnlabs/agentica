const fs = require("node:fs");
const process = require("node:process");

async function main() {
  const input = await fs.promises.readFile(
    `${__dirname}/../src/structures/IAgenticaController.ts`,
    "utf8",
  );
  await fs.promises.writeFile(
    `${__dirname}/../lib/structures/IAgenticaController.d.ts`,
    input,
    "utf8",
  );
};
main().catch((error) => {
  console.error(error);
  process.exit(-1);
});
