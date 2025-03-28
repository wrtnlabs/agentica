afterEach(() => {
  // reset the modules to avoid import cache
  vi.resetModules();

  // unstub all the environment variables
  vi.unstubAllEnvs();
});

describe("cli", () => {
  describe("version", () => {
    it("should return 0.0.0 as version when AGENTICA_VERSION is not set", async () => {
      const { program } = await import("./index");

      // override output to avoid the process to exit
      program.exitOverride().action(() => {});

      // using the exit override to capture the version output
      expect(() => {
        program.parse(["node", "agentica", "--version"]);
      }).toThrow("0.0.0");
    });

    it("should return the version from AGENTICA_VERSION", async () => {
      // stub the environment variable
      vi.stubEnv("AGENTICA_VERSION", "1.2.3");

      const { program } = await import("./index");

      // override output to avoid the process to exit
      program.exitOverride().action(() => {});

      expect(() => {
        program.parse(["node", "agentica", "--version"]);
      }).toThrow("1.2.3");
    });
  });
});
