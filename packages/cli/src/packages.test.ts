import { installCommand } from "./packages";

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

  it("pnpm", () => {
    const packageManager = "pnpm";
    const result = installCommand({ packageManager, pkg: "openai" });
    expect(result).toBe("pnpm add openai");
  });

  it("bun", () => {
    const packageManager = "bun";
    const result = installCommand({ packageManager, pkg: "openai" });
    expect(result).toBe("bun add openai");
  });

  it("unsupported", () => {
    const packageManager = "unsupported";
    // @ts-expect-error type is not matched
    expect(() => installCommand({ packageManager, pkg: "openai" })).toThrowError("Unsupported package manager: unsupported");
  });
});
