# Agentica CLI Tool
```bash
npx agentica start <directory>
npx agentica backend <directory>
npx agentica client <directory> 
```

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/agentica/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/agentica.svg)](https://www.npmjs.com/package/agentica)
[![Downloads](https://img.shields.io/npm/dm/agentica.svg)](https://www.npmjs.com/package/agentica)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild)

Agentica CLI Tool cloning boilerplate project.

  - `start`: a frontend application creating agent in browser
  - `backend`: backend application serving the agent through websocket protocol
  - `client`: frontend application connecting to above websocket server




## Introduction
![agentica-conceptual-diagram](https://github.com/user-attachments/assets/d7ebbd1f-04d3-4b0d-9e2a-234e29dd6c57)

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
await agent.conversate("I wanna buy MacBook Pro");
```

The simplest **Agentic AI** library, specialized in **LLM Function Calling**.

Don't compose complicate agent graph or workflow, but just deliver **Swagger/OpenAPI** documents or **TypeScript class** types linearly to the `@agentica`. Then `@agentica` will do everything with the function calling.

Look at the below demonstration, and feel how `@agentica` is easy and powerful.

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
await agent.conversate("I wanna buy MacBook Pro");
```

> https://github.com/user-attachments/assets/01604b53-aca4-41cb-91aa-3faf63549ea6
>
> Demonstration video of Shopping AI Chatbot
