const fs = require("fs");

const loadPackages = () => {
  const packages = `${__dirname}/../../packages`;
  const directory = fs
    .readdirSync(packages)
    .filter((bucket) => bucket !== "cli");
  return directory.filter((bucket) => {
    const stat = fs.lstatSync(`${packages}/${bucket}`);
    return (
      stat.isDirectory() && fs.existsSync(`${packages}/${bucket}/package.json`)
    );
  });
};
module.exports = { loadPackages };
