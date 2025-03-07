import { Footer, Layout, Navbar } from "nextra-theme-docs";
// Required for theme styles, previously was imported under the hood
import "nextra-theme-docs/style.css";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";

export const metadata = {
  // ... your metadata API
  // https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const navbar = (
  <Navbar
    logo={<b>Agentica</b>}
    projectLink="https://github.com/wrtnlabs/agentica"
  />
);
const footer = (
  <Footer className="flex-col items-center md:items-start">
    MIT {new Date().getFullYear()} © Wrtn Technologies.
  </Footer>
);

export default async function RootLayout(props) {
  return (
    <html
      // Not required, but good for SEO
      lang="en"
      // Required to be set
      dir="ltr"
      // Suggested by `next-themes` package https://github.com/pacocoursey/next-themes#with-app
      suppressHydrationWarning
    >
      <Head
        backgroundColor={{
          dark: "rgb(15, 23, 42)",
          light: "rgb(254, 252, 232)",
        }}
        color={{
          hue: { dark: 120, light: 0 },
          saturation: { dark: 100, light: 100 },
        }}
      >
        {/* ICONS */}
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        {[16, 32].map((size) => (
          <link
            key={size}
            rel="icon"
            type="image/png"
            sizes={`${size}x${size}`}
            href={`/favicon/favicon-${size}x${size}.png`}
          />
        ))}
        {/* OG */}
        <meta name="og:type" content="object" />
        <meta name="og:site_name" content="Agentica Guide Documents" />
        <meta name="og:url" content="https://wrtnlabs.io/agentica" />
        <meta name="og:image" content="/agentica/og.jpg" />
        <meta name="og:title" content="Agentica Guide Documents" />
        <meta
          name="og:description"
          content="Agentic AI Framework specialized in LLM Function Calling enhanced by TypeScript Compiler"
        />
        {/* TWITTER */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@SamchonGithub" />
        <meta
          name="twitter:image"
          content="/agentica/og.jpg"
        />
        <meta name="twitter:title" content="Agentica Guide Documents" />
        <meta
          name="twitter:description"
          content="Agentic AI Framework specialized in LLM Function Calling enhanced by TypeScript Compiler"
        />
      </Head>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/wrtnlabs/agentica/tree/main/website"
          editLink="Edit this page on GitHub"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          footer={footer}
          nextThemes={{
            defaultTheme: "dark",
          }}
          // ...Your additional theme config options
        >
          {props.children}
        </Layout>
      </body>
    </html>
  );
}
