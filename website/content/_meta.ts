import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: {
    title: "Introduction",
    type: "page",
    display: "hidden",
    theme: {
      timestamp: false,
      // typesetting: "article",
      layout: "full",
      // navbar: false,
      toc: false,
      sidebar: false,
      footer: false,
      breadcrumb: false,
      collapsed: false,
      pagination: false,
    },
  },
  blog: {
    title: "Blog",
    type: "page",
    display: "hidden",
    theme: {
      timestamp: false,
      layout: "full",
      toc: false,
      sidebar: false,
      footer: false,
      breadcrumb: false,
      collapsed: false,
      pagination: false,
    },
  },
  docs: {
    title: "📖 Guide Documents",
    type: "page",
  },
  tutorial: {
    title: "🧪 Tutorial Projects",
    type: "page",
  },
  playground: {
    title: "💻 Playground",
    type: "menu",
    items: {
      swagger: {
        title: "Swagger Uploader",
        href: "/playground/uploader/",
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
