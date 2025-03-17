import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    title: "Introduction",
    type: "page",
    display: "hidden",
    theme: {
      timestamp: false,
      typesetting: "article",
      layout: "full",
      navbar: false,
      toc: false,
      sidebar: false,
      breadcrumb: false,
      collapsed: false,
      pagination: false,
    },
  },
  docs: {
    title: "📖 Guide Documents",
    type: "page",
  },
  playground: {
    title: "💻 Playground",
    type: "menu",
    items: {
      swagger: {
        title: "Swagger Uploader",
        href: "/playground/playground/",
      },
      shopping: {
        title: "Shopping AI Chatbot (Swagger)",
        href: "/playground/shopping/",
      },
      bbs: {
        title: "BBS AI Chatbot (TypeScript Class)",
        href: "/playground/bbs/",
      },
    },
  },
  snippets: {
    display: "hidden",
  },
};
export default meta;
