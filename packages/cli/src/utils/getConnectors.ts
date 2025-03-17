import typia, { tags } from "typia";

export interface INpmPackages {
  objects: {
    package: {
      name: string;
    };
  }[];
  total: number;
  time: string & tags.Format<"date-time">;
}

export const getConnectors = async (): Promise<
  { name: string; value: string }[]
> => {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/wrtnlabs/connectors/refs/heads/feature/list-connectors/connectors-list.json",
    );
    const responseJson = (await response.json()) as INpmPackages;

    const data = typia.assert<INpmPackages>(responseJson);

    return data.objects
      .map((pkg) => pkg.package.name)
      .filter((name: string) => {
        // shared is not connector package. This is connector util package.
        if (name === "@wrtnlabs/connector-shared") {
          return false;
        }

        const regex = /^@wrtnlabs\/connector-(?:[a-z0-9-]+)+$/;
        return regex.test(name);
      })
      .map((name: string) => {
        const serviceName = name.replace("@wrtnlabs/connector-", "");
        return {
          name: serviceName.replace("-", " ").toUpperCase(),
          value: serviceName,
        };
      });
  } catch (error) {
    console.error("Error occurred while fetching package list:", error);
    return [];
  }
};
