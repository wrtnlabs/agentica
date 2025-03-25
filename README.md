# Agentica

![agentica-conceptual-diagram](https://github.com/user-attachments/assets/d7ebbd1f-04d3-4b0d-9e2a-234e29dd6c57)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/agentica/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@agentica/core.svg)](https://www.npmjs.com/package/@agentica/core)
[![Downloads](https://img.shields.io/npm/dm/@agentica/core.svg)](https://www.npmjs.com/package/@agentica/core)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild)
[![Guide Documents](https://img.shields.io/badge/Guide-Documents-forestgreen)](https://wrtnlabs.io/agentica/docs/)
[![Gurubase](https://img.shields.io/badge/Gurubase-Document%20Chatbot-006BFF)](https://gurubase.io/g/agentica)

The simplest **Agentic AI** library, specialized in **LLM Function Calling**.

Don't compose complicate agent graph or workflow, but just deliver **Swagger/OpenAPI** documents or **TypeScript class** types linearly to the `agentica`. Then `agentica` will do everything with the function calling.

Look at the below demonstration, and feel how `agentica` is easy and powerful.

```typescript
import { Agentica } from "@agentica/core";
import typia from "typia";

const agent = new Agentica({
  controllers: [
    await fetch(
      "https://shopping-be.wrtn.ai/editor/swagger.json",
    ).then(r => r.json()),
    typia.llm.application<ShoppingCounselor>,
    typia.llm.application<ShoppingPolicy>(),
    typia.llm.application<ShoppingSearchRag>(),
  ],
});
await agent.conversate("I wanna buy MacBook Pro");
```

> https://github.com/user-attachments/assets/01604b53-aca4-41cb-91aa-3faf63549ea6
>
> Demonstration video of Shopping AI Chatbot

<!-- To do: re-capture demonstration video with Wrtnlabs title -->

## Playground

You can experience how typia works by playground website:

💻 https://wrtnlabs.io/agentica/playground

## Guide Documents

Check out the document in the [website](https://wrtnlabs.io/agentica):

### 🏠 Home

- [🚀 Getting Started](https://wrtnlabs.io/agentica/docs)
- [📦 Setup](https://wrtnlabs.io/agentica/docs/setup)
- 🔍 Concepts
  - [Function Calling](https://wrtnlabs.io/agentica/docs/concepts/function-calling)
  - [Document Driven Development](https://wrtnlabs.io/agentica/docs/concepts/document-driven-development)
  - [Compiler Driven Development](https://wrtnlabs.io/agentica/docs/concepts/compiler-driven-development)

### 📖 Features

- **📚 Core Library**
  - [Agentic AI](https://wrtnlabs.io/agentica/docs/core)
  - [Facade Controller](https://wrtnlabs.io/agentica/docs/core/facade)
  - [Configurations](https://wrtnlabs.io/agentica/docs/core/config)
  - [Event Handling](https://wrtnlabs.io/agentica/docs/core/event)
  - [Prompt Histories](https://wrtnlabs.io/agentica/docs/core/history)
- **📡 WebSocket Protocol**
  - [Remote Procedure Call](https://wrtnlabs.io/agentica/docs/websocket)
  - [NestJS Server](https://wrtnlabs.io/agentica/docs/websocket/nestjs)
  - [NodeJS Server](https://wrtnlabs.io/agentica/docs/websocket/nodejs)
  - [Client Application](https://wrtnlabs.io/agentica/docs/websocket/client)
- **🌉 Plugin Modules**
  - [Benchmark Program](https://wrtnlabs.io/agentica/docs/plugins/benchmark)
  - [OpenAI Vector Store](https://wrtnlabs.io/agentica/docs/plugins/openai-vector-store)
  - [PG Vector Selector](https://wrtnlabs.io/agentica/docs/plugins/pg-vector-selector)

### 🔗 Appendix

- [📅 Roadmap](https://wrtnlabs.io/agentica/docs/roadmap)
- 📊 Related Projects
  - [Agent OS](https://wrtnlabs.io/agentica/docs/related/os)
  - [AutoView](https://wrtnlabs.io/agentica/docs/related/autoview)
- [⇲ API Documents](https://wrtnlabs.io/agentica/api)

## How to Contribute?

Please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file for more information.

Thank you for your interest in contributing to Agentica!

<!--
## Roadmap
### Guide Documents
In here README document, `@agentica/core` is introducing its key concepts, principles, and demonstrating some examples.

However, this contents are not fully enough for new comers of AI Chatbot development. We need much more guide documents and example projects are required for education. We have to guide backend developers to write proper definitions optimized for LLM function calling. We should introduce the best way of multi-agent orchestration implementation.

We'll write such fully detailed guide documents until 2025-03-31, and we will continuously release documents that are in the middle of being completed.

### Playground
https://nestia.io/chat/playground

I had developed Swagger AI chatbot playground website for a long time ago.

However, the another part obtaining function schemas from TypeScript class type, it is not prepared yet. I'll make the TypeScript class type based playground website by embedding TypeScript compiler (`tsc`).

The new playground website would be published until 2025-03-15.

### Optimization
As I've concenstrated on POC (Proof of Concept) development on the early stage level, internal agents composing `@agentica/core` are not cost optimized yet. Especially, `selector` agent is consuming LLM tokens too much repeatedly. We'll optimize the `selector` agent by RAG (Retrieval Augmented Generation) skills.

Also, we will support dozens of useful add-on agents which can connect with `@agentica/core` by TypeScript class function calling. One of them is `@wrtnlabs/hive` which optimizes `selector` agent so that reducing LLM costs dramatically. The others would be OpenAI Vector Store handler and Postgres based RAG engine.

With these `@agentica/core` providing add-on agents, you can learn how to implement the Multi-agent orchestration through TypeScript class function calling, and understand how `@agentica/core` makes the Multi agent system interaction super easily. -->
