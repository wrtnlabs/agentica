import { capitalize } from "./utils";

export namespace Connector {
  export type Code = "import" | "connector";

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
          `import { ${capitalize( service,)}Service } from "@wrtnlabs/connector-${service}";`,
      )
      .join("\n");

    return serviceImports;
  };
}
