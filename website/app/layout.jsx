import { Footer, Layout, Navbar } from "nextra-theme-docs";
import Script from "next/script";
import "nextra-theme-docs/style.css";
import { Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";

import "./globals.css";

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
    MIT
    {" "}
    {new Date().getFullYear()}
    {" "}
    © Wrtn Technologies.
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
        // backgroundColor={{
        //   dark: "rgb(9, 15, 27)",
        //   light: "rgb(250, 250, 250)",
        // }}
        // color={{
        //   hue: { dark: 120, light: 0 },
        //   saturation: { dark: 100, light: 100 },
        // }}
      >
        {/* ICONS */}
        <link rel="manifest" href="/agentica/favicon/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/agentica/favicon/apple-touch-icon.png"
        />
        {[16, 32].map(size => (
          <link
            key={size}
            rel="icon"
            type="image/png"
            sizes={`${size}x${size}`}
            href={`/agentica/favicon/favicon-${size}x${size}.png`}
          />
        ))}
        {/* OG */}
        <meta name="og:type" content="object" />
        <meta name="og:site_name" content="Agentica Guide Documents" />
        <meta name="og:url" content="https://wrtnlabs.io/agentica" />
        <meta name="og:image" content="https://wrtnlabs.io/agentica/og.jpg" />
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
          content="https://wrtnlabs.io/agentica/og.jpg"
        />
        <meta name="twitter:title" content="Agentica Guide Documents" />
        <meta
          name="twitter:description"
          content="Agentic AI Framework specialized in LLM Function Calling enhanced by TypeScript Compiler"
        />
        <Script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
(function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "qt7e6ysbbd");
`,
          }}
        />
        {/* <Script
          async
          src="https://widget.gurubase.io/widget.latest.min.js"
          data-widget-id="YVDFrawzFh5RCuDpaFXXR8WKTTi5kH3x-7ASp0HmT44"
          data-text="Ask AI"
          data-margins='{"bottom": "1rem", "right": "1rem"}'
          data-light-mode="true"
          id="guru-widget-id"
        /> */}
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
          darkMode={false}
          // ...Your additional theme config options
        >
          {props.children}
        </Layout>
      </body>
    </html>
  );
}
