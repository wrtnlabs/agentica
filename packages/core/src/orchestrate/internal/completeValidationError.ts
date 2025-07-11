import type { IValidation } from "typia";

export function complementValidationError(
  check: IValidation.IFailure,
): void {
  for (const error of check.errors) {
    if (error.value !== undefined) {
      continue;
    }
    const description: string = [
      "> You AI has not defined the value (\`undefined\`).",
      ">",
      `> Please fill the \`${error.expected}\` typed value at the next time.`,
    ].join("\n");
    if (error.description === undefined || error.description.length === 0) {
      error.description = description;
    }
    else {
      error.description += `\n\n${description}`;
    }
  }
}
