# pg-vector-selector

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/pg-vector-selector/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/pg-vector-selector.svg)](https://www.npmjs.com/package/pg-vector-selector)

A library that significantly accelerates AI function selection through vector embeddings.

## Overview

`@agentica/pg-vector-selector` drastically improves function selection speed compared to traditional LLM-based methods. By leveraging vector embeddings and semantic similarity, it can identify the most appropriate functions for a given context multiple times faster than conventional approaches.

```typescript
import { Agentica } from "@agentica/core";
import { AgenticaPgVectorSelector } from "@agentica/pg-vector-selector";

import typia from "typia";

// Initialize with connector-hive server
const selectorExecute = AgenticaPgVectorSelector.boot<"chatgpt">(
  "https://your-connector-hive-server.com"
);

const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    model: "gpt-4o-mini",
    api: new OpenAI({
      apiKey: process.env.CHATGPT_API_KEY,
    }),
  },
  controllers: [
    await fetch(
      "https://shopping-be.wrtn.ai/editor/swagger.json",
    ).then(r => r.json()),
    typia.llm.application<ShoppingCounselor>(),
    typia.llm.application<ShoppingPolicy>(),
    typia.llm.application<ShoppingSearchRag>(),
  ],
  config: {
    executor: {
      select: selectorExecute,
    }
  }
});
await agent.conversate("I wanna buy MacBook Pro");
```

## How to Use

### Setup

```bash
npm install @agentica/core @agentica/pg-vector-selector typia
npx typia setup
```

To use pg-vector-selector, you need:

1. A running [connector-hive](https://github.com/wrtnlabs/connector-hive) server
2. `PostgreSQL` database connected to the `connector-hive` server
3. pgvector extension installed in `PostgreSQL`

### Initialization

First, initialize the library with your connector-hive server:

```typescript
import { AgenticaPgVectorSelector } from "pg-vector-selector";

const selectorExecute = AgenticaPgVectorSelector.boot<YourSchemaModel>(
  "https://your-connector-hive-server.com"
);
```

### Just apply Selector and Start conversation

Select the most appropriate functions for a given context:

```typescript
const agent = new Agentica({
  model: "chatgpt",
  vendor: {
    model: "gpt-4o-mini",
    api: new OpenAI({
      apiKey: process.env.CHATGPT_API_KEY,
    }),
  },
  controllers: [
    await fetch(
      "https://shopping-be.wrtn.ai/editor/swagger.json",
    ).then(r => r.json()),
    typia.llm.application<ShoppingCounselor>(),
    typia.llm.application<ShoppingPolicy>(),
    typia.llm.application<ShoppingSearchRag>(),
  ],
  config: {
    executor: {
      select: selectorExecute,
    }
  }
});
await agent.conversate("I wanna buy MacBook Pro");
```
