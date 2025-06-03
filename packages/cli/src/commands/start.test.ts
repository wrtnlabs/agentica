/** it is hard to mock fs because we have gigetDownload here, so we use tmp directory */

import type { PackageJson } from "type-fest";

import { createFixture } from "fs-fixture";

import type { Service } from "../connectors";

import { PACKAGE_MANAGERS } from "../packages";

import {
  setupNestJSProject,
  setupNodeJSProject,
  setupReactProject,
  setupStandAloneProject,
} from "./start";

const PACKAGE_MANAGERS_WITHOUT_YARN = PACKAGE_MANAGERS.filter(packageManager => packageManager !== "yarn");
describe("start command integration test", () => {
  it.todo("we support yarn but it doesn't work on CI, so we need to fix it");
  describe.each(PACKAGE_MANAGERS_WITHOUT_YARN)("packageManager: %s", { timeout: 1_000_000_000, concurrent: true }, async (packageManager) => {
    describe("setupStandAloneProject", () => {
      it("should create a new directory and set project .env file", async () => {
        /** create a fixture */
        await using fixture = await createFixture();

        await setupStandAloneProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            services: [],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is standalone project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-standalone");

        // check if the .env file exists
        expect(await fixture.exists(".env")).toBe(true);
        // check if the .env file contains OPENAI_API_KEY
        expect(await fixture.readFile(".env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo");
      });

      it("should create a new directory and set project with services", async () => {
        await using fixture = await createFixture();

        await setupStandAloneProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is standalone project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-standalone");

        // check if `@wrtnlabs/connector-google-map` is installed
        expect(packageJson.dependencies).toHaveProperty("@wrtnlabs/connector-google-map");

        // index.ts includes google-map connector
        const indexTs = await fixture.readFile("src/index.ts", "utf-8");
        expect(indexTs).toContain(`import { GoogleMapService } from "@wrtnlabs/connector-google-map";`);
        expect(indexTs).toContain(`name: "GoogleMap Connector",`);
        expect(indexTs).toContain(`application: typia.llm.application<GoogleMapService, "chatgpt">(),`);
        expect(indexTs).toContain(`execute: new GoogleMapService(),`);
      });
    });

    describe("setupNodeJSProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const fixture = await createFixture();

        await setupNodeJSProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            port: 3000,
            services: [],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is nodejs project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nodejs");

        // check if the .env file exists
        expect(await fixture.exists(".env")).toBe(true);
        // check if the .env file contains OPENAI_API_KEY and PORT
        expect(await fixture.readFile(".env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nPORT=3000");
      });

      it("should create a new directory and set project with services", async () => {
        await using fixture = await createFixture();

        await setupNodeJSProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is nodejs project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nodejs");

        // check if `@wrtnlabs/connector-google-map` is installed
        expect(packageJson.dependencies).toHaveProperty("@wrtnlabs/connector-google-map");

        // index.ts includes google-map connector
        const indexTs = await fixture.readFile("src/index.ts", "utf-8");
        expect(indexTs).toContain(`import { GoogleMapService } from "@wrtnlabs/connector-google-map";`);
        expect(indexTs).toContain(`name: "GoogleMap Connector",`);
        expect(indexTs).toContain(`application: typia.llm.application<GoogleMapService, "chatgpt">(),`);
        expect(indexTs).toContain(`execute: new GoogleMapService(),`);
      });
    });

    describe("setupNestJSProject", () => {
      it("should create a new directory and set project .env file", async () => {
        await using fixture = await createFixture();

        await setupNestJSProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            openAIKey: "sk-foo",
            port: 3000,
            services: [],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is nestjs project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nestjs");

        // check if the .env file exists
        expect(await fixture.exists(".env")).toBe(true);
        // check if the .env file contains OPENAI_API_KEY and PORT
        expect(await fixture.readFile(".env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nAPI_PORT=3000");
      });

      it("should create a new directory and set project with services", async () => {
        await using fixture = await createFixture();

        await setupNestJSProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            openAIKey: "",
            services: ["google-map" as Service],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is nestjs project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-nestjs");

        // check if `@wrtnlabs/connector-google-map` is installed
        expect(packageJson.dependencies).toHaveProperty("@wrtnlabs/connector-google-map");

        // index.ts includes google-map connector
        const indexTs = await fixture.readFile("src/controllers/chat/ChatController.ts", "utf-8");
        expect(indexTs).toContain(`import { GoogleMapService } from "@wrtnlabs/connector-google-map";`);
        expect(indexTs).toContain(`name: "GoogleMap Connector",`);
        expect(indexTs).toContain(`application: typia.llm.application<GoogleMapService, "chatgpt">(),`);
        expect(indexTs).toContain(`execute: new GoogleMapService(),`);
      });
    });

    describe("setupReactProject", () => {
      it("should create a new directory and set project .env file", async () => {
        const fixture = await createFixture();

        await setupReactProject({
          projectAbsolutePath: fixture.path,
          context: {
            packageManager,
            port: 3000,
            openAIKey: "sk-foo",
            services: [],
          },
        });

        // check if the directory exists
        expect(await fixture.exists()).toBe(true);
        expect(await fixture.exists("package.json")).toBe(true);

        // check template is react project
        const packageJson = JSON.parse(await fixture.readFile("package.json", "utf-8")) as PackageJson;
        expect(packageJson.name).toBe("agentica-template-react");

        // check if the .env file exists
        expect(await fixture.exists(".env")).toBe(true);
        // check if the .env file contains OPENAI_API_KEY
        expect(await fixture.readFile(".env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nVITE_AGENTICA_WS_URL=ws://localhost:3000/chat");
      });
    });
  });
});
