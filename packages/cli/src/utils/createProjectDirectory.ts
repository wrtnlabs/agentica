import fs from "fs";
import path from "path";

export const createProjectDirectory = (input: {
  projectName: string;
}): { projectPath: string } => {
  const projectPath = path.join(process.cwd(), input.projectName);
  if (fs.existsSync(projectPath)) {
    throw new Error(`${input.projectName} directory already exists.`);
  }

  fs.mkdirSync(projectPath);

  return { projectPath };
};
