import type { Tagged, UnwrapTagged } from "type-fest";
import typia from "typia";
import { capitalize } from "./utils";

const CONNECTORS_LIST_URL = 'https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/main/connectors-list.json' as const;
const CONNECTOR_PREFIX = '@wrtnlabs/connector-' as const;

/** Service name. Opaque type. */
export type Service = Tagged<string, "Service">;

type Connector = `${typeof CONNECTOR_PREFIX}${string}`;

interface Connectors {
  connectors: Connector[];
  version: string;
}

/**
  * Get the list of connectors from the wrtnlabs/connectors repository.
  */
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

/**
  * Get the list of connectors from the wrtnlabs/connectors repository.
  * result is formatted for the user interface.
  * @returns {
  *   packageName: original package name,
  *   serviceName: removed `@wrtnlabs/connector-` and capitalized service name,
  *   displayName: capitalized service name with spaces
  */
export async function getConnectors(): Promise<ReadonlyArray<GetConnectorsReturn>> {
  const data = await getConnectorsList();
  return data.connectors
    .map((name) => {
      const serviceName = (name.replace(CONNECTOR_PREFIX, "") satisfies UnwrapTagged<Service>) as Service
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
export function generateConnectorsArrayCode(services: Service[]): string {
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
export function generateServiceImportsCode(services: Service[]): string {
  const serviceImports = services
  .map(
    (service) => `import { ${capitalize(service)}Service } from "${CONNECTOR_PREFIX}${service}";`
  )
  .join("\n");

  return serviceImports;
}
