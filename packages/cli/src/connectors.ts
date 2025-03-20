import { capitalize } from "./utils";

/**
  * Generate code for the `connectors` array.
  * it should be placed in controllers property of Agentica's initialization object.
  */
export function generateConnectorsArrayCode(services: string[]): string {
  const serviceConnectors = services
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

export const createImport = (input: { services: string[] }) => {
  // Generate import statements for selected services
  const serviceImports = input.services
  .map(
    (service) =>
      `import { ${capitalize(service)}Service } from "@wrtnlabs/connector-${service}";`,
  )
  .join("\n");

  return serviceImports;
};
