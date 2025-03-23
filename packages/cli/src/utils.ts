/**
 * @module
 * This file contains tiny utility functions that should not be in rest of the modules.
 */

import { styleText } from "node:util";

/**
 * Convert a string to a capitalized string.
 * @example
 * capitalize("chatgpt") // "Chatgpt"
 * capitalize("aws-s3") // "AwsS3"
 */
export function capitalize(service: string): string {
  return service
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

export function blueBright(text: string) {
  return styleText("blueBright", text);
}

export function redBright(text: string) {
  return styleText("redBright", text);
}

export function yellow(text: string) {
  return styleText("yellow", text);
}

/**
 * Format the given content with prettier.
 * If prettier is not installed, it returns the content as is.
 */
export async function formatWithPrettier(content: string) {
  /** if prettier is not installed, return undefined */
  const prettier = await import("prettier").catch(() => undefined);

  // if prettier is not installed, return the content as is
  if (prettier == null) {
    return content;
  }

  // format the content with prettier
  return prettier.format(content, {
    parser: "typescript",
  });
}
