import { createFixture } from "fs-fixture";

import { createDirectory, writeEnvKeysToDotEnv } from "./fs";

describe("createDirectory", () => {
  it("should create a new directory", async () => {
    await using fixture = await createFixture();
    await createDirectory({ projectPath: fixture.getPath("my-new-project") });
    expect(await fixture.exists("my-new-project")).toBe(true);
  });

  it("should throw an error if the directory already exists", async () => {
    /** suppose the directory already exists */
    await using fixture = await createFixture({
      "my-new-project/.dummy": "dummy content",
    });

    const projectPath = fixture.getPath("my-new-project");
    await expect(createDirectory({ projectPath }))
      .rejects
      .toThrow("my-new-project directory already exists.");
  });
});

describe("writeEnvKeysToDotEnv", () => {
  it("should set project empty .env file", async () => {
    /** ensure the directory exists */
    await using fixture = await createFixture();

    await writeEnvKeysToDotEnv({
      projectPath: fixture.path,
      dotEnvfileName: ".env",
      apiKeys: [],
    });

    expect(await fixture.exists(".env")).toBe(true);
  });

  it("should add api keys to the .env file", async () => {
    /** ensure the directory exists */
    await using fixture = await createFixture();

    await writeEnvKeysToDotEnv({
      projectPath: fixture.path,
      dotEnvfileName: ".env",
      apiKeys: [
        { key: "OPENAI_API_KEY", value: "sk-foo" },
      ],
    });

    expect (await fixture.readFile(".env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo");
  });

  it("should add multiple api keys to the .env file", async () => {
    /** ensure the directory exists */
    await using fixture = await createFixture();

    await writeEnvKeysToDotEnv({
      projectPath: fixture.path,
      dotEnvfileName: ".env",
      apiKeys: [
        { key: "OPENAI_API_KEY", value: "sk-foo" },
        { key: "OPENAI_API_SECRET", value: "sk-bar" },
      ],
    });

    expect(await fixture.readFile(".env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nOPENAI_API_SECRET=sk-bar");
  });

  it("should set default .env file name if not provided", async () => {
    /** ensure the directory exists */
    await using fixture = await createFixture();

    await writeEnvKeysToDotEnv({
      projectPath: fixture.path,
      apiKeys: [
        { key: "OPENAI_API_KEY", value: "sk-foo" },
      ],
    });

    expect(await fixture.exists(".env")).toBe(true);
  });

  it("should append api keys to the existing .env file", async () => {
    /** ensure the directory exists */
    await using fixture = await createFixture({
      "my-new-project": {
        ".env": "OPENAI_API_KEY=sk-foo",
      },
    });

    await writeEnvKeysToDotEnv({
      projectPath: fixture.getPath("my-new-project"),
      dotEnvfileName: ".env",
      apiKeys: [
        { key: "OPENAI_API_SECRET", value: "sk-bar" },
      ],
    });

    expect(await fixture.readFile("my-new-project/.env", "utf-8")).toBe("OPENAI_API_KEY=sk-foo\nOPENAI_API_SECRET=sk-bar");
  });

  it("should throw an error if the directory does not exist", async () => {
    await using fixture = await createFixture();

    await expect(writeEnvKeysToDotEnv({
      projectPath: fixture.getPath("my-new-project"),
      dotEnvfileName: ".env",
      apiKeys: [],
    }))
      .rejects
      .toThrow("/my-new-project directory does not exist.");
  });
});
