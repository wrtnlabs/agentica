import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: "🚀 Getting Started",
  setup: "📦 Setup",
  "function-calling": "⛲ Function Calling",

  "-- features": {
    type: "separator",
    title: "📖 Features",
  },
  core: {
    title: "Core Library",
    theme: {
      collapsed: false,
    },
  },
  websocket: {
    title: "WebSocket Protocol",
    theme: {
      collapsed: false,
    },
  },
  plugins: {
    title: "Plugin Modules",
    theme: {
      collapsed: false,
    },
  },

  "-- appendix": {
    type: "separator",
    title: "🔗 Appendix",
  },
  os: "Agent OS",
  autoview: "AutoView",
  roadmap: "Roadmap",
  api: {
    title: "⇲ API Documents",
    href: "../api",
  },
};
export default meta;
