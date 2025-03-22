import { fs, vol } from 'memfs';

vi.mock('node:fs')
vi.mock('node:fs/promises')

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset()
})

describe("createDirectory", () => {
  it("should create a new directory", async () => {
    fs.mkdirSync("my-new-project", { recursive: true });
    await createDirectory({ projectPath: "/my-new-project" });

    expect(fs.existsSync("/my-new-project")).toBe(true);
  });


  it("should throw an error if the directory already exists", async () => {
    /** suppose the directory already exists */
    vol.mkdirSync("my-new-project", { recursive: true })

    await expect(createDirectory({ projectPath: "my-new-project" }))
      .rejects
      .toThrow("my-new-project directory already exists.");
  });
})

