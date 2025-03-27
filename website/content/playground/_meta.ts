import type { MetaRecord } from "nextra";

const theme = {
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
} as const;

const meta: MetaRecord = {
  uploader: {
    title: "Swagger Uploader",
    type: "page",
    display: "hidden",
    theme,
  },

  shopping: {
    title: "Shopping AI Chatbot",
    type: "page",
    display: "hidden",
    theme,
  },

  bbs: {
    title: "BBS AI Chatbot",
    type: "page",
    display: "hidden",
    theme,
  },
};
export default meta;
