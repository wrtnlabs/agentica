import fs from "node:fs";
import path from "node:path";

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
