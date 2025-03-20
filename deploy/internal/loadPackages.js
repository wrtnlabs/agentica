const fs = require("fs");

const loadPackages = () => {
  const packages = `${__dirname}/../../packages`;
  const directory = fs.readdirSync(packages);

  return directory
    .filter((bucket) => {
      const stat = fs.lstatSync(`${packages}/${bucket}`);
      return (
        stat.isDirectory() &&
        fs.existsSync(`${packages}/${bucket}/package.json`)
      );
    })
    .sort((a, b) =>
      a === "chat" ? 1 : b === "chat" ? -1 : a.localeCompare(b),
    );
};
module.exports = { loadPackages };
