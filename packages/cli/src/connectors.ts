import typia from "typia";
import { capitalize } from "./utils";
import { Tagged } from "type-fest";

/** Service name. Opaque type. */
type Service = Tagged<string, "Service">;

type Connector = `@wrtnlabs/connector-${string}`;

interface Connectors {
  connectors: Connector[];
  version: string;
}

const CONNECTORS_LIST_URL = 'https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/main/connectors-list.json';

export async function getConnectorsList(): Promise<Connectors> {
  const response = await fetch(CONNECTORS_LIST_URL);
  const responseJson = (await response.json());
  const data = typia.assert<Connectors>(responseJson);
  return data;
}

interface GetConnectorsReturn {
  packageName: Connector;
  serviceName: Service;
  displayName: string;
};

export async function getConnectors(): Promise<ReadonlyArray<GetConnectorsReturn>> {
  const data = await getConnectorsList();
  return data.connectors
    .map((name) => {
      const serviceName = (name.replace("@wrtnlabs/connector-", "") satisfies string) as Service
      const displayName = serviceName.replace("-", " ").toUpperCase();
      return {
        packageName: name,
        serviceName,
        displayName,
      };
    });
}

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
