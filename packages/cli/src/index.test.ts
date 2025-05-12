import picocolors from "picocolors";

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

/** mock the intro function from '@clack/prompts' */
const promptIntroMock = vi.fn();

describe("version", () => {
  it("test the version command", async () => {
    const { version } = await import("../package.json");
    const { program } = await import("./index");

    // override output to avoid the process to exit
    program.exitOverride().action(() => {});

    expect(() => {
      program.parse(["node", "agentica", "--version"]);
    }).toThrow(version);
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

    /* mock the intro function from '@clack/prompts' */
    vi.mock("@clack/prompts", async () => ({
      ...(await vi.importActual("@clack/prompts")),
      intro: promptIntroMock,
    }));
  });

  it("test the start command with no project option", async () => {
    const { program } = await import("./index");

    // override output to avoid the process to exit
    program.exitOverride();

    program.parse(["node", "agentica", "start"]);

    // check the options is empty
    const opts = program.opts();
    expect(opts).toEqual({});

    // check start message is called with proper arguments
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
    expect(promptIntroMock.mock.calls[0][0]).toEqual(`🚀 ${picocolors.blueBright("Agentica")} Setup Wizard`);

    // check the start command is called with proper arguments
    expect(startMock).toHaveBeenCalledOnce();
    expect(startMock.mock.calls[0][0]).toEqual({ template: "nodejs" });
  });

  it("test the start command with empty project option", async () => {
    const { program } = await import("./index");

    // override output to avoid the process to exit
    program.exitOverride();

    expect(() => {
      program.parse(["node", "agentica", "start", "--project"]);
    }).toThrow();

    // check start message is not called because of the error
    expect(startMock).not.toHaveBeenCalled();
  });

  it("test the start command with invalid project option", async () => {
    const { program } = await import("./index");

    // override output to avoid the process to exit
    program.exitOverride();

    expect(() => {
      program.parse(["node", "agentica", "start", "--project", "invalid"]);
    }).toThrow();

    // check start message is not called because of the error
    expect(startMock).not.toHaveBeenCalled();
  });
});
