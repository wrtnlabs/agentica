/**
 * @module
 * This file contains tiny utility functions that should not be in rest of the modules.
 */
import detectIndent from "detect-indent";
import indentString from "indent-string";

/**
 * Convert a string to a capitalized string.
 * @example
 * capitalize("chatgpt") // "Chatgpt"
 * capitalize("aws-s3") // "AwsS3"
 */
export function capitalize(service: string): string {
  // @TODO cover the snake case or apply string literal type return type(ex: HOTScript)
  return service
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Format the given content with indent-string.
 * If indent-string & detect-indent is not installed,
 * it returns the content as is.
 */
export function insertWithIndent(
  content: string,
  placeholder: string,
  code: string,
): string {
  try {
    const indent = detectIndent(content);
    const indentedCode = indentString(code, indent.amount, { indent: " " });
    return content.replace(placeholder, indentedCode);
  }
  catch {
    return content;
  }
}
