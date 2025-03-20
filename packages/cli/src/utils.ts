import fs from "node:fs";
import path from "node:path";
import typia from "typia";
import { styleText } from 'node:util'

// Convert first letter to uppercase (ex: aws-s3 -> AwsS3)
export const capitalize = (service: string): string => {
  return service
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
};

export const createProjectDirectory = (input: {
  projectPath: string;
}): void => {
  if (fs.existsSync(input.projectPath)) {
    throw new Error(
      `${path.basename(input.projectPath)} directory already exists.`,
    );
  }

  fs.mkdirSync(input.projectPath);
};


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


export function blueBright(text: string) {
  return styleText("blueBright", text);
}

export function redBright(text: string) {
  return styleText("redBright", text);
}

export function yellow(text: string) {
  return styleText("yellow", text);
}
