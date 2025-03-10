import axios from "axios";

export const getNpmPackages = async (): Promise<
  { name: string; value: string }[]
> => {
  try {
    const response = await axios.get(
      "https://registry.npmjs.org/-/v1/search?text=scope:@wrtnlabs&size=1000",
    );
    const data: any = response.data;

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
