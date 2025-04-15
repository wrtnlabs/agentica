import { wrtnlabs } from "@wrtnlabs/eslint-config";

export default wrtnlabs({
  typescript: false,
  ignores: ["packages", "test", "website", "benchmark"],
});
