# Agentica, AI Function Calling Framework

https://github.com/user-attachments/assets/5326cc59-5129-470d-abcb-c3f458b5c488

![Logo](https://wrtnlabs.io/agentica/logo.png)

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/agentica/blob/master/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/@agentica/core.svg)](https://www.npmjs.com/package/@agentica/core)
[![NPM Downloads](https://img.shields.io/npm/dm/@agentica/core.svg)](https://www.npmjs.com/package/@agentica/core)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild)
[![Guide Documents](https://img.shields.io/badge/Guide-Documents-forestgreen)](https://wrtnlabs.io/agentica/)
[![Discord Badge](https://img.shields.io/badge/discord-samchon-d91965?style=flat&labelColor=5866f2&logo=discord&logoColor=white&link=https://discord.gg/E94XhzrUCZ)](https://discord.gg/aMhRmzkqCx)

Agentic AI framework specialized in AI Function Calling.

Don't be afraid of AI agent development. Just list functions from three protocols below. This is the everything you should do for AI agent development.

- TypeScript Class
- Swagger/OpenAPI Document
- MCP (Model Context Protocol) Server

Want to make an e-commerce agent? Bring in e-commerce functions. Want to make a newsletter agent? Just get functions from a newspaper company. Just prepare any functions what yo need, then it becomes AI agent.

You're a TypeScript developer? Then you're already an AI developer. You know how to do backend development? Then you're well-prepared AI developer. Anyone who can make function, they can make AI agent.

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

## 📦 Setup

```bash
$ npx agentica start <directory>

----------------------------------------
 Agentica Setup Wizard
----------------------------------------
? Package Manager (use arrow keys)
  > npm
    pnpm
    yarn (berry is not supported)
? Project Type
    NodeJS Agent Server
  > NestJS Agent Server
    React Client Application
    Standalone Application
? Embedded Controllers (multi-selectable)
    (none)
    Google Calendar
    Google News
  > Github
    Reddit
    Slack
    ...
```

You can create a new Agentica project using the above command.

In the CLI setup wizard, you can choose the type of project. If you don't choose Standalone Application but others, it will utilize the [WebSocket Protocol](https://wrtnlabs.io/agentica/docs/websocket/) for network interaction between server and client.

For more details, check out the [Getting Started](https://wrtnlabs.io/agentica/docs/) guide.

## 💻 Playground

You can experience Agentia by [playground website](https://wrtnlabs.io/agentica/playground).

Feel how Agentica's function calling is strong by demonstration. And if you satisfy, install Agentica and start AI development. Agentica must be easier than any other AI frameworks.

- [TypeScript Class](https://wrtnlabs.io/agentica/playground/bbs)
- [Swagger/OpenAPI Document](https://wrtnlabs.io/agentica/playground/swagger)
- [Enterprise e-commerce agent](https://wrtnlabs.io/agentica/playground/shopping)

<!--
@todo this section would be changed after making tutorial playground
-->

## 📚 Documentation

Check out the document in the [website](https://wrtnlabs.io/agentica).

- [Home](https://wrtnlabs.io/agentica)
- [Guide Documents](https://wrtnlabs.io/agentica/docs)
- [Tutorial](https://wrtnlabs.io/agentica/tutorial)
- [API Documents](https://wrtnlabs.io/agentica/api)
- [Youtube](https://www.youtube.com/@wrtnlabs)
- [Paper](https://wrtnlabs.io/agentica/paper)

## 🌟 Why Agentica?

```mermaid
flowchart
  subgraph "JSON Schema Specification"
    schemav4("JSON Schema v4 ~ v7") --upgrades--> emended[["OpenAPI v3.1 (emended)"]]
    schema2910("JSON Schema 2019-03") --upgrades--> emended
    schema2020("JSON Schema 2020-12") --emends--> emended
  end
  subgraph "Agentica"
    emended --"Artificial Intelligence"--> fc{{"AI Function Calling"}}
    fc --"OpenAI"--> chatgpt("ChatGPT")
    fc --"Google"--> gemini("Gemini")
    fc --"Anthropic"--> claude("Claude")
    fc --"High-Flyer"--> deepseek("DeepSeek")
    fc --"Meta"--> llama("Llama")
    chatgpt --"3.1"--> custom(["Custom JSON Schema"])
    gemini --"3.0"--> custom(["Custom JSON Schema"])
    claude --"3.1"--> standard(["Standard JSON Schema"])
    deepseek --"3.1"--> standard
    llama --"3.1"--> standard
  end
```

Agentica enhances AI function calling by below strategies.

- [JSON schema conversion](https://wrtnlabs.io/agentica/docs/core/vendor/#schema-specification): specs are different across LLM vendors
- [Validation Feedback](https://wrtnlabs.io/agentica/docs/concepts/function-calling#validation-feedback): correct AI's mistakes on arguments composition
- [Selector Agent](https://wrtnlabs.io/agentica/docs/concepts/function-calling#orchestration-strategy): filtering candidate functions to reduce context

Thanks to these strategies, AI function calling becomes easier, safer, and more accurate than ever. When developing an AI agent, development becomes clearer because you only need to prepare functions that match the agent you want to create, and adding or removing agent functions is also very simple.

Such function calling driven AI development method was invented in 2023 when function calling was first announced by OpenAI. However, function calling was difficult and unstable, so it was abandoned, and the inflexible workflow driven AI development method became popular instead.

However, now that Agentica has made function calling easy, safe, scalable, and mass productive, it is time to start function calling driven AI development again.
