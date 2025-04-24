# Agentica

https://github.com/user-attachments/assets/5326cc59-5129-470d-abcb-c3f458b5c488

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/agentica/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@agentica/core.svg)](https://www.npmjs.com/package/@agentica/core)
[![Downloads](https://img.shields.io/npm/dm/@agentica/core.svg)](https://www.npmjs.com/package/@agentica/core)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild)

Agentic AI framework specialized in AI Function Calling.

Don't be afraid of AI development. Just list functions from three protocols below. This is the everything you should do for AI development.

Want to make an e-commerce agent? Bring in e-commerce functions. Want to make a newsletter agent? Just get functions from a newspaper company.

- TypeScript Class
- Swagger/OpenAPI Document
- MCP (Model Context Protocol) Server

```typescript
import { Agentica, assertHttpLlmApplication } from "@agentica/core";
import OpenAI from "openai";
import typia from "typia";

import { MobileFileSystem } from "./services/MobileFileSystem";

const agent = new Agentica({
  vendor: {
    api: new OpenAI({ apiKey: "********" }),
    model: "gpt-4o-mini",
  },
  controllers: [
    // functions from TypeScript class
    {
      protocol: "http",
      application: typia.llm.application<MobileFileSystem, "chatgpt">(),
      execute: new MobileFileSystem(),
    },
    // functions from Swagger/OpenAPI
    {
      protocol: "http",
      application: assertHttpLlmApplication({
        model: "chatgpt",
        document: await fetch(
          "https://shopping-be.wrtn.ai/editor/swagger.json",
        ).then(r => r.json()),
      }),
      connection: {
        host: "https://shopping-be.wrtn.ai",
        headers: { Authorization: "Bearer ********" },
      },
    },
  ],
});
await agent.conversate("I wanna buy MacBook Pro");
```

## Key Features

## Quick Start

## Why Agentica?
