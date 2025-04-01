/** it is hard to mock fs because we have gigetDownload here, so we use tmp directory */

import type { PackageJson } from "type-fest";
import type { Service } from "../connectors";
import { existsSync } from "node:fs";
import { readFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { PACKAGE_MANAGERS } from "../packages";
import {
  setupNestJSProject,
  setupNodeJSProject,
  setupReactProject,
  setupStandAloneProject,
} from "./start";

beforeAll(async () => {
  await rm(resolve(import.meta.dirname, ".tmp"), { recursive: true, force: true });
});

describe("start command integration test", { timeout: 60_000 }, () => {
  describe.each(PACKAGE_MANAGERS)("packageManager: %s", (packageManager) => {
    describe("setupStandAloneProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/standalone");

        await setupStandAloneProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            services: [],
          },
        });

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
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/standalone-with-google-map");

        await setupStandAloneProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

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
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/nodejs");

        await setupNodeJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            port: 3000,
            services: [],
          },
        });

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
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/nodejs-with-google-map");

        await setupNodeJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

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
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/nestjs");

        await setupNestJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            port: 3000,
            services: [],
          },
        });

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
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/nestjs-with-google-map");

        await setupNestJSProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

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
        const destinationDirectory = resolve(import.meta.dirname, ".tmp/react");

        await setupReactProject({
          projectAbsolutePath: destinationDirectory,
          context: {
            packageManager,
            port: 3000,
            openAIKey: "sk-foo",
            services: [],
          },
        });

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
