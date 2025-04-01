import { detectPackageManager, installCommand } from "./packages";

describe("installCommand", () => {
  it("npm", () => {
    const packageManager = "npm";
    const result = installCommand({ packageManager, pkg: "openai" });
    expect(result).toBe("npm install openai");
  });

  it("yarn", () => {
    const packageManager = "yarn";
    const result = installCommand({ packageManager, pkg: "openai" });
    expect(result).toBe("yarn add openai");
  });

  it("yarn without package", () => {
    const packageManager = "yarn";
    const result = installCommand({ packageManager });
    expect(result).toBe("yarn");
  });

  it("pnpm", () => {
    const packageManager = "pnpm";
    const result = installCommand({ packageManager, pkg: "openai" });
    expect(result).toBe("pnpm install openai");
  });

  it("bun", () => {
    const packageManager = "bun";
    const result = installCommand({ packageManager, pkg: "openai" });
    expect(result).toBe("bun install openai");
  });

  it("unsupported", () => {
    const packageManager = "unsupported";
    // @ts-expect-error type is not matched
    expect(() => installCommand({ packageManager, pkg: "openai" })).toThrowError("Unsupported package manager: unsupported");
  });
});

describe("detectPackageManager", () => {
  beforeAll(() => {
    vi.unstubAllEnvs();
  });

  it("npm", () => {
    vi.stubEnv("npm_config_user_agent", "npm/7.24.0 node/v16.13.0 linux x64");
    const result = detectPackageManager();
    expect(result).toBe("npm");
  });

  it("yarn", () => {
    vi.stubEnv("npm_config_user_agent", "yarn/3.1.1 npm/? node/v16.13.0 linux x64");
    const result = detectPackageManager();
    expect(result).toBe("yarn");
  });

  it("pnpm", () => {
    vi.stubEnv("npm_config_user_agent", "pnpm/7.24.0 node/v16.13.0 linux x64");
    const result = detectPackageManager();
    expect(result).toBe("pnpm");
  });

  it("bun", () => {
    vi.stubEnv("npm_config_user_agent", "bun/7.24.0 node/v16.13.0 linux x64");
    const result = detectPackageManager();
    expect(result).toBe("bun");
  });

  it("unsupported", () => {
    vi.stubEnv("npm_config_user_agent", "unsupported/7.24.0 node/v16.13.0 linux x64");
    const result = detectPackageManager();
    expect(result).toBe("npm");
  });
});
