import { install } from "./install";

describe("install", () => {
  it('npm', () => {
    const packageManager = "npm";
    const result = install({ packageManager, pkg: "openai" });
    expect(result).toBe("npm install openai");
  });

  it('yarn', () => {
    const packageManager = "yarn";
    const result = install({ packageManager, pkg: "openai" });
    expect(result).toBe("yarn add openai");
  });

  it('pnpm', () => {
    const packageManager = "pnpm";
    const result = install({ packageManager, pkg: "openai" });
    expect(result).toBe("pnpm add openai");
  });

  it('bun', () => {
    const packageManager = "bun";
    const result = install({ packageManager, pkg: "openai" });
    expect(result).toBe("bun add openai");
  });

  it('unsupported', () => {
    const packageManager = "unsupported";
    // @ts-expect-error type is not matched
    expect(() => install({ packageManager, pkg: "openai" })).toThrowError("Unsupported package manager: unsupported");
  });
});
