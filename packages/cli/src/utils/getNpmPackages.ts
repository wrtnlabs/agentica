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

export const getNpmPackages = async (): Promise<
  { name: string; value: string }[]
> => {
  try {
    const response = await fetch(
      "https://registry.npmjs.org/-/v1/search?text=scope:@wrtnlabs&size=10000",
    );
    const responseJson = await response.json();
    const data = typia.assert<INpmPackages>(responseJson);

    return data.objects
      .map((pkg: any) => pkg.package.name)
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
