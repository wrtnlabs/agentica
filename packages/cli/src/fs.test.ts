import { fs, vol } from 'memfs';
import createDirectory from './fs';

vi.mock('node:fs')
vi.mock('node:fs/promises')

describe("createDirectory", () => {
  beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset()
  })

  it("should create a new directory", () => {
    fs.mkdirSync("my-new-project", { recursive: true });
    createDirectory({ projectPath: "/my-new-project" });

    expect(fs.existsSync("/my-new-project")).toBe(true);
  });


  it("should throw an error if the directory already exists", () => {
    /** suppose the directory already exists */
    vol.mkdirSync("my-new-project", { recursive: true })

    expect(() => {
      createDirectory({ projectPath: "my-new-project" });
    }).toThrow("my-new-project directory already exists.");
  });
})

