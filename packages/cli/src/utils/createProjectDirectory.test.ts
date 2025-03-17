import { createProjectDirectory } from "./createProjectDirectory";
import { fs, vol } from 'memfs'

vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset()
})

describe("createProjectDirectory", () => {
  it("should create a new directory", () => {
    fs.mkdirSync("my-new-project", { recursive: true });
    createProjectDirectory({ projectPath: "/my-new-project" });

    expect(fs.existsSync("/my-new-project")).toBe(true);
  });


  it("should throw an error if the directory already exists", () => {
    /** suppose the directory already exists */
    vol.mkdirSync("my-new-project", { recursive: true })

    expect(() => {
      createProjectDirectory({ projectPath: "my-new-project" });
    }).toThrow("my-new-project directory already exists.");
  });
})
