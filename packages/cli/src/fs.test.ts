import { vol } from "memfs";
import { createDirectory, writeEnvKeysToDotEnv } from "./fs";

vi.mock("node:fs");
vi.mock("node:fs/promises");

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset();
});

describe("createDirectory", () => {
  it("should create a new directory", async () => {
    await createDirectory({ projectPath: "/my-new-project" });
    expect(vol.existsSync("/my-new-project")).toBe(true);
  });

  it("should throw an error if the directory already exists", async () => {
    /** suppose the directory already exists */
    vol.mkdirSync("my-new-project", { recursive: true });

    await expect(createDirectory({ projectPath: "my-new-project" }))
      .rejects
      .toThrow("my-new-project directory already exists.");
  });
});

describe("writeEnvKeysToDotEnv", () => {
  it("should set project empty .env file", async () => {
    /** ensure the directory exists */
    vol.mkdirSync("/my-new-project", { recursive: true });

    await writeEnvKeysToDotEnv({
      projectPath: "/my-new-project",
      dotEnvfileName: ".env",
      apiKeys: [],
    });

    expect(vol.existsSync("/my-new-project/.env")).toBe(true);
  });

  it("should add api keys to the .env file", async () => {
    /** ensure the directory exists */
    vol.mkdirSync("/my-new-project", { recursive: true });

    await writeEnvKeysToDotEnv({
      projectPath: "/my-new-project",
      dotEnvfileName: ".env",
      apiKeys: [
        { key: "OPENAI_API_KEY", value: "sk-foo" },
      ],
    });

    const content = vol.readFileSync("/my-new-project/.env", "utf-8");

    expect(content).toBe("OPENAI_API_KEY=sk-foo");
  });

  it("should add multiple api keys to the .env file", async () => {
    /** ensure the directory exists */
    vol.mkdirSync("/my-new-project", { recursive: true });

    await writeEnvKeysToDotEnv({
      projectPath: "/my-new-project",
      dotEnvfileName: ".env",
      apiKeys: [
        { key: "OPENAI_API_KEY", value: "sk-foo" },
        { key: "OPENAI_API_SECRET", value: "sk-bar" },
      ],
    });

    const content = vol.readFileSync("/my-new-project/.env", "utf-8");

    expect(content).toBe("OPENAI_API_KEY=sk-foo\nOPENAI_API_SECRET=sk-bar");
  });

  it("should set default .env file name if not provided", async () => {
    /** ensure the directory exists */
    vol.mkdirSync("/my-new-project", { recursive: true });

    await writeEnvKeysToDotEnv({
      projectPath: "/my-new-project",
      apiKeys: [
        { key: "OPENAI_API_KEY", value: "sk-foo" },
      ],
    });

    expect(vol.existsSync("/my-new-project/.env")).toBe(true);
  });

  it("should append api keys to the existing .env file", async () => {
    /** ensure the directory exists */
    vol.mkdirSync("/my-new-project", { recursive: true });

    vol.writeFileSync("/my-new-project/.env", "OPENAI_API_KEY=sk-foo");

    await writeEnvKeysToDotEnv({
      projectPath: "/my-new-project",
      dotEnvfileName: ".env",
      apiKeys: [
        { key: "OPENAI_API_SECRET", value: "sk-bar" },
      ],
    });

    const content = vol.readFileSync("/my-new-project/.env", "utf-8");

    expect(content).toBe("OPENAI_API_KEY=sk-foo\nOPENAI_API_SECRET=sk-bar");
  });

  it("should throw an error if the directory does not exist", async () => {
    await expect(writeEnvKeysToDotEnv({
      projectPath: "/my-new-project",
      dotEnvfileName: ".env",
      apiKeys: [],
    }))
      .rejects
      .toThrow("/my-new-project directory does not exist.");
  });
});
