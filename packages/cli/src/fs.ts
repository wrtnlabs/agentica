import { existsSync } from "node:fs";
import { rm, appendFile, mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { downloadTemplate } from "giget";

interface DownloadTemplateAndPlaceInProjectProps {
  /** template name to specify the repository */
  template: string;
  /** current project directory. must be an empty directory and absolute path */
  project: string;
}

/**
   * Download template from repository and place in project directory.
   */
export async function downloadTemplateAndPlaceInProject({ template, project }: DownloadTemplateAndPlaceInProjectProps): Promise<void> {
  // COPY PROJECTS
  await downloadTemplate(`github:wrtnlabs/agentica.template.${template}`, {
    dir: project,
  });

  // remove dependabot.yml if exists
  await rm(join(project, ".github/dependabot.yml"), { force: true });
}

/**
  * Create a new directory.
  */
export async function createDirectory(input: { projectPath: string }): Promise<void> {
  if (existsSync(input.projectPath)) {
    throw new Error(
      `${input.projectPath} directory already exists.`,
    );
  }

  await mkdir(input.projectPath);
};

interface WriteEnvKeysToDotEnvProps {
  projectPath: string;
  dotEnvfileName?: string;
  apiKeys: {
    key: string;
    value: string;
  }[];
}

/**
   * Set project .env files
   */
export async function writeEnvKeysToDotEnv({projectPath, dotEnvfileName, apiKeys}: WriteEnvKeysToDotEnvProps): Promise<void> {
  if (!existsSync(projectPath)) {
    throw new Error(
      `${projectPath} directory does not exist.`,
    );
  }

  const dotEnvPath = join(projectPath, dotEnvfileName ?? ".env");
  const isDotEnvExists = existsSync(dotEnvPath);

  /** create .env content */
  const envKeys = 
    /** if .env file exists, add a new line */
    (isDotEnvExists ? "\n" : "") +
    /** join api keys */
    apiKeys.map(({ key, value }) => `${key}=${value}`).join("\n");

  await appendFile(dotEnvPath, envKeys);
}

interface WriteFileWithPrettierFormatProps {
  filePath: string;
  content: string;
}
