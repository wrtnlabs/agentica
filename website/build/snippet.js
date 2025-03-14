const fs = require("fs");

const snippet = async ({ 
  package, 
  location,
}) => {
  if (location.endsWith(".ts") === false)
    location = `${location}.ts`;
  const name = location.split("/").pop().split(".")[0];
  await fs.promises.writeFile(
    `${__dirname}/../content/snippets/${name}Snippet.mdx`,
    [
      `\`\`\`typescript filename="${package}/${name}" showLineNumbers`,
      (await fs.promises.readFile(location, "utf-8")).trim(),
      "```",
    ].join("\n"),
    "utf8",
  );
};

const main = async () => {
  for (const file of [
    "structures/IAgenticaProps", 
    "structures/IAgenticaVendor",
    "structures/IAgenticaController",
    "structures/IAgenticaConfig", 
    "structures/IAgenticaExecutor",
    "structures/IAgenticaSystemPrompt",
    "context/AgenticaContext",
    // "context/AgenticaOperation",
    // "context/AgenticaOperationSelection",
    "json/IAgenticaPromptJson",
  ])
    await snippet({
      package: "@agentica/core",
      location: `${__dirname}/../../packages/core/src/${file}`,
    });
};
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
