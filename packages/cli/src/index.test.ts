afterEach(() => {
  // reset the modules to avoid import cache
  vi.resetModules();

  // unstub all the environment variables
  vi.unstubAllEnvs();

  // reset all the mocks
  vi.resetAllMocks();
});

/** mock the 'start' function from './commands/start' */
const startMock = vi.fn();

/** mock the error log functions from '@clack/prompts' */
const promptLogErrorMock = vi.fn();

/** mock the intro function from '@clack/prompts' */
const promptIntroMock = vi.fn();

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

  describe("start subcommand", () => {
    beforeAll(async () => {
    /**
     * check start from './commands/start' is called with proper arguments
     * to do that, mock the './commands/start' module
     */
      vi.mock("./commands/start", async () => ({
        ...(await vi.importActual("./commands/start")),
        start: startMock,
      }));

      /* mock the 'p.log.error' function from '@clack/prompts' */
      vi.mock("@clack/prompts", async () => ({
        ...(await vi.importActual("@clack/prompts")),
        intro: promptIntroMock,
        log: {
          error: promptLogErrorMock,
        },
      }));
    });

    it("test the start command with no project option", async () => {
      const { program } = await import("./index");

      // override output to avoid the process to exit
      program.exitOverride();

      program.parse(["node", "agentica", "start"]);
      const opts = program.opts();
      expect(opts).toEqual({});
      expect(startMock).toHaveBeenCalledOnce();
      expect(startMock.mock.calls[0][0]).toEqual({ template: undefined });
    });

    it("test the start command with project option", async () => {
      const { program } = await import("./index");

      // override output to avoid the process to exit
      program.exitOverride();

      // Setup the start command's option directly
      program.parse(["node", "agentica", "start", "--project", "nodejs"]);

      /** check start message is called with proper arguments */
      expect(promptIntroMock).toHaveBeenCalledOnce();
      expect(promptIntroMock.mock.calls[0][0]).toMatchInlineSnapshot(`"🚀 Agentica Setup Wizard"`);

      expect(startMock).toHaveBeenCalledOnce();
      expect(startMock.mock.calls[0][0]).toEqual({ template: "nodejs" });
    });

    it("test the start command with empty project option", async () => {
      const { program } = await import("./index");

      // override output to avoid the process to exit
      program.exitOverride();

      program.parse(["node", "agentica", "start", "--project"]);

      expect(startMock).not.toHaveBeenCalled();

      expect(promptLogErrorMock).toHaveBeenCalledOnce();
      const args = promptLogErrorMock.mock.calls[0][0] as unknown as string;
      expect(args.trim()).toEqual("❌ The value of --project is required");
    });

    it("test the start command with invalid project option", async () => {
      const { program } = await import("./index");

      // override output to avoid the process to exit
      program.exitOverride();

      program.parse(["node", "agentica", "start", "--project", "invalid"]);

      expect(startMock).not.toHaveBeenCalled();

      expect(promptLogErrorMock).toHaveBeenCalledOnce();
      const args = promptLogErrorMock.mock.calls[0][0] as unknown as string;
      expect(args.trim()).toEqual("❌ The value of --project is invalid");
    });
  });
});
