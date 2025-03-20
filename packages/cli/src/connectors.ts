import typia from "typia";
import { capitalize } from "./utils";

export interface Connectors {
  connectors: string[];
  version: string;
}

const CONNECTORS_LIST_URL = 'https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/main/connectors-list.json';

export const getConnectorsList = async (): Promise<Connectors> => {
  const response = await fetch(CONNECTORS_LIST_URL);
  const responseJson = (await response.json());
  const data = typia.assert<Connectors>(responseJson);
  return data;
};

export const getConnectors = async (): Promise<
{ name: string; value: string }[]
> => {
  const data = await getConnectorsList();
  return data.connectors
    .map((name) => {
      const serviceName = name.replace("@wrtnlabs/connector-", "");
      return {
        name: serviceName.replace("-", " ").toUpperCase(),
        value: serviceName,
      };
    });
};


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

/**
  * Generate import statements for selected services
  */
export function generateServiceImportsCode(services: string[]): string {
  const serviceImports = services
  .map(
    (service) => `import { ${capitalize(service)}Service } from "@wrtnlabs/connector-${service}";`
  )
  .join("\n");

  return serviceImports;
}
