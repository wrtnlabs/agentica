import { styleText } from 'node:util';

/**
* Convert a string to a capitalized string.
* @example
* capitalize("chatgpt") // "Chatgpt"
* capitalize("aws-s3") // "AwsS3"
*/
export const capitalize = (service: string): string => {
  return service
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
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
