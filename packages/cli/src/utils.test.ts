import { capitalize, createProjectDirectory, getConnectors, getConnectorsList, } from "./utils";
import { fs, vol } from 'memfs';

describe("capitalize", () => {
  it("should return a string with the first letter capitalized", () => {
    expect(capitalize("aws-s3")).toBe("AwsS3");
  });
})

describe("createProjectDirectory", () => {
  vi.mock('node:fs')
  vi.mock('node:fs/promises')

  beforeEach(() => {
    // reset the state of in-memory fs
    vol.reset()
  })

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

describe('getConnectorsList', () => {
  it('should return a list of connectors', async () => {
    const connectors = await getConnectorsList();
    expect(connectors).toEqual({
      connectors: [
        '@wrtnio/connector-google-map',
      ],
      version: '1.0.0',
    });
  });
})

describe('getConnectors', () => {
  it('should return a list of connectors', async () => {
    const connectors = await getConnectors();
    expect(connectors).toEqual([
      { name: '@WRTNIO/CONNECTOR GOOGLE-MAP', value: '@wrtnio/connector-google-map' }
    ]);
  });
})

