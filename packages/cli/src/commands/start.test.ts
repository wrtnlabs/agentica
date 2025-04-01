/** it is hard to mock fs because we have gigetDownload here, so we use tmp directory */

import type { PackageJson } from "type-fest";
import type { Service } from "../connectors";
import type { PackageManager } from "../packages";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import process from "node:process";
import { PACKAGE_MANAGERS } from "../packages";
import * as Utils from "../utils";
import {
  setupNestJSProject,
  setupNodeJSProject,
  setupReactProject,
  setupStandAloneProject,
} from "./start";

function generateRandomAlphanumericString(length: number): string {
  const alphabet
    = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    result += alphabet[randomIndex];
  }

  return result;
}

const execAsyncMock = vi.spyOn(Utils, "execAsync");

afterEach(() => {
  execAsyncMock.mockClear();
});

const TEST_PACKAGE_MANAGERS = (process.env.START_COMMAND_TEST_PACKAGE_MANAGERS?.split(",") ?? PACKAGE_MANAGERS) as PackageManager[];
if (TEST_PACKAGE_MANAGERS.length === 0 || !PACKAGE_MANAGERS.includes(TEST_PACKAGE_MANAGERS.at(0) as PackageManager)) {
  throw new Error("Invalid package manager");
}

describe("start command integration test", () => {
  it.todo("we support yarn but it doesn't work on CI, so we need to fix it");
  describe.each(TEST_PACKAGE_MANAGERS)("packageManager: %s", { timeout: 1_000_000 }, (packageManager) => {
    const tmpParentDirectory = resolve(tmpdir(), generateRandomAlphanumericString(8));
    afterAll(async () => {
      await rm(tmpParentDirectory, { recursive: true, force: true });
    }, 60_000);

    describe("setupStandAloneProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/standalone");

        await setupStandAloneProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            services: [],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install `, { cwd: destinationDirectory });

        // check prepare command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(2, `${packageManager} run prepare`, { cwd: destinationDirectory });

        // check if the directory exists

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is standalone project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-standalone");

        // check if the .env file exists
        expect(existsSync(resolve(destinationDirectory, ".env"))).toBe(true);
        // check if the .env file contains OPENAI_API_KEY
        expect(await readFile(resolve(destinationDirectory, ".env"), "utf-8")).toBe("OPENAI_API_KEY=sk-foo");
      });

      it("should create a new directory and set project with services", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/standalone-with-google-map");

        await setupStandAloneProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install @wrtnlabs/connector-google-map`, { cwd: destinationDirectory });

        // check prepare command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(2, `${packageManager} run prepare`, { cwd: destinationDirectory });

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is standalone project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-standalone");

        // check if `@wrtnlabs/connector-google-map` is installed
        expect(packageJson.dependencies).toHaveProperty("@wrtnlabs/connector-google-map");

        // index.ts includes google-map connector
        const indexTs = await readFile(resolve(destinationDirectory, "src/index.ts"), "utf-8");
        expect(indexTs).toContain(`import { GoogleMapService } from "@wrtnlabs/connector-google-map";`);
        expect(indexTs).toContain(`name: "GoogleMap Connector",`);
        expect(indexTs).toContain(`application: typia.llm.application<GoogleMapService, "chatgpt">(),`);
        expect(indexTs).toContain(`execute: new GoogleMapService(),`);
      });
    });

    describe("setupNodeJSProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/nodejs");

        await setupNodeJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            port: 3000,
            services: [],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install `, { cwd: destinationDirectory });

        // check prepare command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(2, `${packageManager} run prepare`, { cwd: destinationDirectory });

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is nodejs project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nodejs");

        // check if the .env file exists
        expect(existsSync(resolve(destinationDirectory, ".env"))).toBe(true);
        // check if the .env file contains OPENAI_API_KEY and PORT
        expect(await readFile(resolve(destinationDirectory, ".env"), "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nPORT=3000");
      });

      it("should create a new directory and set project with services", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/nodejs-with-google-map");

        await setupNodeJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install @wrtnlabs/connector-google-map`, { cwd: destinationDirectory });

        // check prepare command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(2, `${packageManager} run prepare`, { cwd: destinationDirectory });

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is nodejs project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nodejs");

        // check if `@wrtnlabs/connector-google-map` is installed
        expect(packageJson.dependencies).toHaveProperty("@wrtnlabs/connector-google-map");

        // index.ts includes google-map connector
        const indexTs = await readFile(resolve(destinationDirectory, "src/index.ts"), "utf-8");
        expect(indexTs).toContain(`import { GoogleMapService } from "@wrtnlabs/connector-google-map";`);
        expect(indexTs).toContain(`name: "GoogleMap Connector",`);
        expect(indexTs).toContain(`application: typia.llm.application<GoogleMapService, "chatgpt">(),`);
        expect(indexTs).toContain(`execute: new GoogleMapService(),`);
      });
    });

    describe("setupNestJSProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/nestjs");

        await setupNestJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            port: 3000,
            services: [],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install `, { cwd: destinationDirectory });

        // check prepare command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(2, `${packageManager} run prepare`, { cwd: destinationDirectory });

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is nestjs project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nestjs");

        // check if the .env file exists
        expect(existsSync(resolve(destinationDirectory, ".env"))).toBe(true);
        // check if the .env file contains OPENAI_API_KEY and PORT
        expect(await readFile(resolve(destinationDirectory, ".env"), "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nAPI_PORT=3000");
      });

      it("should create a new directory and set project with services", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/nestjs-with-google-map");

        await setupNestJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install @wrtnlabs/connector-google-map`, { cwd: destinationDirectory });

        // check prepare command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(2, `${packageManager} run prepare`, { cwd: destinationDirectory });

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is nestjs project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nestjs");

        // check if `@wrtnlabs/connector-google-map` is installed
        expect(packageJson.dependencies).toHaveProperty("@wrtnlabs/connector-google-map");

        // index.ts includes google-map connector
        const indexTs = await readFile(resolve(destinationDirectory, "src/controllers/chat/ChatController.ts"), "utf-8");
        expect(indexTs).toContain(`import { GoogleMapService } from "@wrtnlabs/connector-google-map";`);
        expect(indexTs).toContain(`name: "GoogleMap Connector",`);
        expect(indexTs).toContain(`application: typia.llm.application<GoogleMapService, "chatgpt">(),`);
        expect(indexTs).toContain(`execute: new GoogleMapService(),`);
      });
    });

    describe("setupReactProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const destinationDirectory = resolve(tmpParentDirectory, ".tmp/react");

        await setupReactProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            port: 3000,
            openAIKey: "sk-foo",
            services: [],
          },
        });

        // check if install command is called
        expect(execAsyncMock).toHaveBeenNthCalledWith(1, `${packageManager} install `, { cwd: destinationDirectory });

        // react project doesn't have prepare script

        // check if the directory exists
        expect(existsSync(destinationDirectory)).toBe(true);
        expect(existsSync(resolve(destinationDirectory, "package.json"))).toBe(true);

        // check template is react project
        const packageJson = JSON.parse(await readFile(resolve(destinationDirectory, "package.json"), "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-react");

        // check if the .env file exists
        expect(existsSync(resolve(destinationDirectory, ".env"))).toBe(true);
        // check if the .env file contains OPENAI_API_KEY
        expect(await readFile(resolve(destinationDirectory, ".env"), "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nVITE_AGENTICA_WS_URL=ws://localhost:3000/chat");
      });
    });
  });
});
