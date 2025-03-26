import unTypiaNext from "@ryoppippi/unplugin-typia/next";
import nextra from "nextra";

const withNextra = nextra({
  // ... Other Nextra config options
});

const nextConfig = unTypiaNext(withNextra({
  basePath: "/agentica",
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}), { cache: false });

// You can include other Next.js configuration options here, in addition to Nextra settings:
export default nextConfig;
