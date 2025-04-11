<p align="center" >
    <img src="./docs/AgenticaFN.png" width="300" height="300" alt="Agentica Logo" />
</p>
<h1 align="center">Agentica</h1>
<p align="center">
<a href="https://www.npmjs.com/package/@agentica/core">
  <img src="https://img.shields.io/npm/v/@agentica/core?style=for-the-badge" alt="npm version">
</a>
<a href="https://www.npmjs.com/package/@agentica/core">
  <img src="https://img.shields.io/npm/dm/@agentica/core?style=for-the-badge" alt="Downloads">
</a>
<a href="https://github.com/samchon/typia">
    <img src="https://img.shields.io/badge/poweredby-Typia-blue?style=for-the-badge" alt="Badge">
</a>
<!-- [![](https://dcbadge.limes.pink/api/server/INVITE)](https://discord.gg/INVITE) -->
<a href="https://discord.gg/aMhRmzkqCx">
  <img src="https://dcbadge.limes.pink/api/server/https://discord.gg/aMhRmzkqCx" alt="Discord">
</a>
</p>

<p align="center">
    <strong>Agentic AI Framework specialized in LLM Function Calling</strong>
    <br>
    <strong>enhanced by TypeScript compiler skills</strong>
</p>

<p align="center">
    <img src="https://github.com/user-attachments/assets/d7ebbd1f-04d3-4b0d-9e2a-234e29dd6c57" alt="agentica-conceptual-diagram">
</p>

---

<h3 align="center">

[Homepage](https://wrtnlabs.io/agentica) // [Documentation](https://wrtnlabs.io/agentica/docs) // [Tutorials](https://youtube.com) // [Playground](https://wrtnlabs.io/agentica/playground)

</h3>

---

_Agentica_ is an open-source framework that makes working with AI agents simple and reliable. It helps you integrate structured function calls with Large Language Models (LLMs) without the usual headaches.

Built around [Typia's](https://typia.io/) robust JSON Schema validation, Agentica eliminates the common frustrations of building agent systems - no more dealing with unpredictable outputs or complex integration challenges.

## 🚀 Key Features

- **✅ Schema-Driven Reliability**: Automatically validates and corrects parameters from LLMs.
- **🔄 Automatic Error Correction**: Feedback loops to iteratively improve output accuracy.
- **📐 Complex Parameter Support**: Easily handle union types, nested objects, and recursive schemas.
- **🌐 OpenAPI Integration**: Convert existing APIs into powerful agent capabilities effortlessly.
- **👨‍💻 Exceptional Developer Experience**: TypeScript-first approach with automatic schema generation.
- **🛠️Model Context Protocol(MCP) Support**: Seamlessly integrate with various LLMs, including Claude Desktop, Cursor, and more.

## ⚡ Quickstart

### Step 1. Setup Agentica project

_For more details, check out the [Getting Started](https://wrtnlabs.io/agentica/docs/setup/) guide._

You can create a new Agentica project using the following command:

```sh
# npm
npx agentica@latest start

# yarn
yarn agentica start

# pnpm
pnpx agentica start

# bun
bunx agentica start
```

### Step 2. Creaste your own AI agent

Open `src/index.ts` and create your own agent.

Agentica accepts TypeScript types and OpenAPI specifications as input. You can use any of the following:

- **TypeScript Types**: Define your own types and let Agentica generate the OpenAPI spec for you, powered by Typia.
- **OpenAPI Specification**: Use an existing OpenAPI spec to create an agent. Agentica converts it for tool calling!
- **Custom Controllers**: Create your own controllers to extend Agentica's functionality.

<!-- eslint-skip -->

```typescript
import { Agentica } from "@agentica/core";
import typia from "typia";

const agent = new Agentica({
  controllers: [
    await fetch(
      "https://shopping-be.wrtn.ai/editor/swagger.json",
    ).then(r => r.json()),
    typia.llm.application<ShoppingCounselor>(),
    typia.llm.application<ShoppingPolicy>(),
    typia.llm.application<ShoppingSearchRag>(),
  ],
});
await agent.conversate("I wanna buy a MacBook Pro");
```

### Step 3. Run your agent

Let's play with your agent!

```sh
npm run build
npm run start # 🎉
```

## 🌟 Why Choose Agentica?

Traditional LLM frameworks struggle with structured outputs:

| Problem Area           | Vanilla LLMs        | ✅ Agentica             |
| ---------------------- | ------------------- | ----------------------- |
| Parameter Validation   | ❌ Poor reliability | ✅ JSON Schema-driven   |
| Complex Data Handling  | ❌ Struggles        | ✅ Robust Typia support |
| Error Correction       | ❌ Manual           | ✅ Auto-correcting loop |
| Integration Complexity | ❌ High effort      | ✅ Seamless OpenAPI     |

---

## 📚 Documentation & Tutorials & Paper

- [Getting Started](https://wrtnlabs.io/agentica/docs/getting-started)
- [Tutorials](https://wrtnlabs.io/agentica/tutorial/)
- [API Reference](https://wrtnlabs.io/agentica/docs/api)
- [Paper](https://wrtnlabs.io/agentica/docs/paper)

---

## 💬 Community & Support

- [Discord](https://discord.gg/aMhRmzkqCx)

---

## 👐 Contributing

We welcome contributions from the community! Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

## ⚖️ License

Agentica is open-source and available under the [MIT License](https://github.com/wrtnlabs/agentica/blob/main/LICENSE).

---

---

<p align="center">
  <img src="https://github.com/user-attachments/assets/2a143ef8-6a9d-4258-96ce-fb3a59137a5b" alt="Wrtn Technologies Logo"/>
</p>

<div align="center">
Agentica is proudly developed and maintained by [Wrtn Technologies](https://wrtnlabs.io).<br>
Empowering developers to build reliable and structured AI agents effortlessly.
</div>

---
