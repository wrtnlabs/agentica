import type { MetaRecord } from "nextra";

const meta: MetaRecord = {
  index: "🚀 Getting Started",
  setup: "📦 Setup",
  concepts: {
    title: "🔍 Concepts",
    theme: {
      collapsed: false,
    },
  },

  "-- features": {
    type: "separator",
    title: "📖Features",
  },
  core: {
    title: "📚 Core Library",
    theme: {
      collapsed: false,
    },
  },
  websocket: {
    title: "📡 WebSocket Protocol",
    theme: {
      collapsed: false,
    },
  },
  plugins: {
    title: "🌉 Plugin Modules",
    theme: {
      collapsed: false,
    },
  },

  "-- appendix": {
    type: "separator",
    title: "🔗 Appendix",
  },
  roadmap: "📅 Roadmap",
  related: {
    title: "📊 Related Projects",
    theme: {
      collapsed: false,
    },
  },
  api: {
    title: "⇲ API Documents",
    href: "/api",
  },
};
export default meta;
