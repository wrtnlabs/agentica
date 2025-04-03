/**
 * @module
 * This file contains functions to work with connectors/services.
 */

import type { Tagged, UnwrapTagged } from "type-fest";

import typia from "typia";

import { capitalize } from "./utils";

const CONNECTORS_LIST_URL = "https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/main/connectors-list.json";
const CONNECTOR_PREFIX = "@wrtnlabs/connector-";

/**
 * Service name. Opaque type. or Branded type.
 * @see https://michalzalecki.com/nominal-typing-in-typescript/#approach-4-intersection-types-and-brands
 */
export type Service = Tagged<string, "Service">;

/** Connector name. String literal type. */
export type Connector = `${typeof CONNECTOR_PREFIX}${Service}`;

/** Unwrap tagged service type because typia doesn't support tagged types */
export type UnwrapTaggedService = UnwrapTagged<Service>;
export type UnwrapTaggedConnector = `${typeof CONNECTOR_PREFIX}${UnwrapTaggedService}`;

interface Connectors {
  connectors: Connector[];
  version: string;
}

interface UnwrapTaggedConnectors {
  connectors: UnwrapTaggedConnector[];
  version: string;
}

export function serviceToConnector(service: Service): Connector {
  return `${CONNECTOR_PREFIX}${service}`;
}

export function connectorToService(connector: Connector): Service {
  return (connector.replace(CONNECTOR_PREFIX, "") satisfies UnwrapTaggedService) as Service;
}

/**
 * Get the list of connectors from the wrtnlabs/connectors repository.
 */
export async function getConnectorsList(): Promise<Connectors> {
  const response = await fetch(CONNECTORS_LIST_URL);
  const responseJson = await response.json() as unknown;
  const data = typia.assert<UnwrapTaggedConnectors>(responseJson) as unknown as Connectors;
  return data;
}

interface GetConnectorsReturn {
  /** original package name */
  packageName: Connector;

  /** removed `@wrtnlabs/connector-` and capitalized service name */
  serviceName: Service;

  /** capitalized service name with spaces */
  displayName: string;
};

/**
 * Get the list of connectors from the wrtnlabs/connectors repository.
 * result is formatted for the user interface.
 * @returns {
 *   packageName: original package name,
 *   serviceName: removed `@wrtnlabs/connector-` and capitalized service name,
 *   displayName: capitalized service name with spaces
 * }[]
 */
export async function getConnectors(): Promise<GetConnectorsReturn[]> {
  const data = await getConnectorsList();
  return data.connectors
    .map((name) => {
      const serviceName = connectorToService(name);
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
      service => `import { ${capitalize(service)}Service } from "${CONNECTOR_PREFIX}${service}";`,
    )
    .join("\n");

  return serviceImports;
}

interface InsertCodeIntoAgenticaStarterProps {
  /** original content of the Agentica Starter template */
  content: string;

  /** generated import statements, replace "/// INSERT IMPORT HERE" */
  importCode: string;

  /** generated connectors array code, replace "/// INSERT CONTROLLER HERE" */
  connectorCode: string;
}

/**
 * Insert generated code into the Agentica Starter template.
 * @param {{
 *   content: string; - original content of the Agentica Starter template
 *   importCode: string; - generated import statements, replace "/// INSERT IMPORT HERE"
 *   connectorCode: string; - generated connectors array code, replace "/// INSERT CONTROLLER HERE"
 * }} props
 */
export function insertCodeIntoAgenticaStarter({
  content,
  importCode,
  connectorCode,
}: InsertCodeIntoAgenticaStarterProps): string {
  return content
    .replace("/// INSERT IMPORT HERE", importCode)
    .replace("/// INSERT CONTROLLER HERE", connectorCode);
}
