import nextra from "nextra";
import unTypiaNext from "@ryoppippi/unplugin-typia/next";
import { NextConfig } from "next";

const configWrapper = [
  nextra({}),
  unTypiaNext,
] satisfies Array<(config: NextConfig) => NextConfig>;

const nextConfig = configWrapper.reduce<NextConfig>((acc, wrapper) => wrapper(acc), {
  // ... Other Next.js config options
  basePath: "/agentica",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
});

export default nextConfig;