import fs from "node:fs";
import path from "node:path";
import { styleText } from 'node:util';

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

export function blueBright(text: string) {
  return styleText("blueBright", text);
}

export function redBright(text: string) {
  return styleText("redBright", text);
}

export function yellow(text: string) {
  return styleText("yellow", text);
}
