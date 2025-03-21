import { capitalize } from "../utils/capitalize";

export namespace Connector {
  export type Code = "import" | "connector";

  export const createAll = (input: { services: string[] }): string => {
    // Generate import statements for selected services
    const serviceImports = create("import")({ services: input.services });

    // Create Connector
    const serviceConnectors = create("connector")({ services: input.services });

    // Generate agentica code
    const codeTemplate = `
import { Agentica } from "@agentica/core";
import typia from "typia";
import dotenv from "dotenv";
import { OpenAI } from "openai";
${serviceImports}

dotenv.config();

export const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    }),
    model: "gpt-4o-mini",
  },
  controllers: [
    ${serviceConnectors}
  ],
});
  `;

    return codeTemplate;
  };

  export const create =
    (code: Code) =>
    (input: { services: string[] }): string => {
      switch (code) {
        case "import":
          return createImport(input);
        case "connector":
          return createConnector(input);
      }
    };

  const createConnector = (input: { services: string[] }): string => {
    const serviceConnectors = input.services
      .map((service) => {
        const serviceName = capitalize(service);
        return `{
      name: "${serviceName} Connector",
      protocol: "class",
      application: typia.llm.application<${serviceName}Service, "chatgpt">(),
      execute: new ${serviceName}Service(),
    }`;
      })
      .join(",\n");

    return serviceConnectors;
  };

  const createImport = (input: { services: string[] }) => {
    // Generate import statements for selected services
    const serviceImports = input.services
      .map(
        (service) =>
          `import { ${capitalize(
            service,
          )}Service } from "@wrtnlabs/connector-${service}";`,
      )
      .join("\n");

    return serviceImports;
  };
}
