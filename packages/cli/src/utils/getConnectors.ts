import typia from "typia";

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
