# Agentica, AI Function Calling Framework

![Agentica - ReadMe Diagram](https://github.com/user-attachments/assets/ecd06d51-b818-41c8-ab31-f0e40f48034e)

<!-- Github/NPM Badges -->
<p align="center">
  <a href="https://github.com/wrtnlabs/agentica/blob/master/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License"/></a>
  <a href="https://www.npmjs.com/package/@agentica/core"><img src="https://img.shields.io/npm/v/@agentica/core.svg" alt="NPM Version"/></a>
  <a href="https://www.npmjs.com/package/@agentica/core"><img src="https://img.shields.io/npm/dm/@agentica/core.svg" alt="NPM Downloads"/></a>
  <a href="https://dormoshe.io/newsletters/373"><img src="https://img.shields.io/badge/DorMoshe%20Newsletter-Top%20%236%20of%201K-orange?style=flat&logo=rss" alt="Newsletter Top #6"/></a>
 <a href="https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild"><img src="https://github.com/wrtnlabs/agentica/workflows/build/badge.svg" alt="Build Status"/></a>
</p>

<!-- Youtube + Discord -->
<p align="center">
  <a href="https://www.youtube.com/@wrtnlabs"><img src="https://img.shields.io/badge/YouTube%20Tutorial-0d1117?style=social&logo=youtube" alt="YouTube"/></a>&nbsp;
  <a href="https://discord.gg/aMhRmzkqCx"><img src="https://img.shields.io/badge/Discord-0d1117?style=social&logo=discord" alt="Discord"/></a>
</p>

Agentic AI framework specialized in AI Function Calling.

Don't be afraid of AI agent development. Just list functions from three protocols below. This is everything you should do for AI agent development.

- TypeScript Class
- Swagger/OpenAPI Document
- MCP (Model Context Protocol) Server

Wanna make an e-commerce agent? Bring in e-commerce functions. Need a newspaper agent? Get API functions from the newspaper company. Just prepare any functions that you need, then it becomes an AI agent.

Are you a TypeScript developer? Then you're already an AI developer. Familiar with backend development? You're already well-versed in AI development. Anyone who can make functions can make AI agents.

<!-- eslint-skip -->

```typescript

import { Agentica, assertHttpController } from "@agentica/core";
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
    typia.llm.controller<MobileFileSystem, "chatgpt">(
      "filesystem",
      MobileFileSystem(),
    ),
    // functions from Swagger/OpenAPI
    assertHttpController({
      name: "shopping",
      model: "chatgpt",
      document: await fetch(
        "https://shopping-be.wrtn.ai/editor/swagger.json",
      ).then(r => r.json()),
      connection: {
        host: "https://shopping-be.wrtn.ai",
        headers: { Authorization: "Bearer ********" },
      },
    }),
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

The setup wizard helps you create a new project tailored to your needs.

For reference, when selecting a project type, any option other than "Standalone Application" will implement the [WebSocket Protocol](https://wrtnlabs.io/agentica/docs/websocket/) for client-server communication.

For comprehensive setup instructions, visit our [Getting Started](https://wrtnlabs.io/agentica/docs/) guide.

## 💻 Playground

Experience Agentica firsthand through our [interactive playground](https://wrtnlabs.io/agentica/playground) before installing.

Our demonstrations showcase the power and simplicity of Agentica's function calling capabilities across different integration methods.

- [TypeScript Class](https://wrtnlabs.io/agentica/playground/bbs)
- [Swagger/OpenAPI Document](https://wrtnlabs.io/agentica/playground/uploader)
- [Enterprise E-commerce Agent](https://wrtnlabs.io/agentica/playground/shopping)

![E-commerce Agent Demo](https://github.com/user-attachments/assets/fbfa9f93-304c-4728-933e-deb8ecd7a2af)

<!--
@todo this section would be changed after making tutorial playground
-->

## 📚 Documentation Resources

Find comprehensive resources at our [official website](https://wrtnlabs.io/agentica).

- [Home](https://wrtnlabs.io/agentica)
- [Guide Documents](https://wrtnlabs.io/agentica/docs)
  - [Setup](https://wrtnlabs.io/agentica/docs/setup/cli/)
  - [Concepts](https://wrtnlabs.io/agentica/docs/concepts/function-calling/)
  - [Core Library](https://wrtnlabs.io/agentica/docs/core/)
  - [WebSocket Protocol](https://wrtnlabs.io/agentica/docs/websocket/)
  - [Plugin Modules](https://wrtnlabs.io/agentica/docs/plugins/benchmark/)
- [Tutorial](https://wrtnlabs.io/agentica/tutorial)
  - [Productivity](https://wrtnlabs.io/agentica/tutorial/productivity/arxiv/)
  - [Coding](https://wrtnlabs.io/agentica/tutorial/coding/file-system/)
  - [React Native](https://wrtnlabs.io/agentica/tutorial/react-native/sms/)
  - [Enterprise](https://wrtnlabs.io/agentica/tutorial/enterprise/shopping/)
- [API Documents](https://wrtnlabs.io/agentica/api)
- [Youtube](https://www.youtube.com/@wrtnlabs)
- [Paper](https://wrtnlabs.io/agentica/paper)

https://github.com/user-attachments/assets/2f2a4cdc-6cf1-4304-b82d-04a8ed0be0dd

> Tutorial Videos: https://www.youtube.com/@wrtnlabs

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

Agentica enhances AI function calling by the following strategies:

- [**Compiler Driven Development**](https://wrtnlabs.io/agentica/docs/concepts/compiler-driven-development): constructs function calling schema automatically by compiler skills without hand-writing.
- [**JSON Schema Conversion**](https://wrtnlabs.io/agentica/docs/core/vendor/#schema-specification): automatically handles specification differences between LLM vendors, ensuring seamless integration regardless of your chosen AI model.
- [**Validation Feedback**](https://wrtnlabs.io/agentica/docs/concepts/function-calling#validation-feedback): detects and corrects AI mistakes in argument composition, dramatically reducing errors and improving reliability.
- [**Selector Agent**](https://wrtnlabs.io/agentica/docs/concepts/function-calling#orchestration-strategy): filtering candidate functions to minimize context usage, optimize performance, and reduce token consumption.

Thanks to these innovations, Agentica makes AI function calling easier, safer, and more accurate than before. Development becomes more intuitive since you only need to prepare functions relevant to your specific use case, and scaling your agent's capabilities is as simple as adding or removing functions.

In 2023, when OpenAI announced function calling, many predicted that function calling-driven AI development would become the mainstream. However, in reality, due to the difficulty and instability of function calling, the trend in AI development became agent workflow. Agent workflow, which is inflexible and must be created for specific purposes, has conquered the AI agent ecosystem.

By the way, as Agentica has resolved the difficulty and instability problems of function calling, the time has come to embrace function-driven AI development once again.

| Type        | Workflow      | Vanilla Function Calling | Agentica Function Calling |
| ----------- | ------------- | ------------------------ | ------------------------- |
| Purpose     | ❌ Specific   | 🟢 General               | 🟢 General                |
| Difficulty  | ❌ Difficult  | ❌ Difficult             | 🟢 Easy                   |
| Stability   | 🟢 Stable     | ❌ Unstable              | 🟢 Stable                 |
| Flexibility | ❌ Inflexible | 🟢 Flexible              | 🟢 Flexible               |

## 🙋 Frequently Asked Questions (FAQ)

**General**

### Q: **How do I install Agentica?**

A: Install Agentica using npm:

```
npm install @agentica/core @samchon/openapi typia
npx typia setup
```

For CLI-based project setup:

```
npx agentica@latest start
```

### Q: **What’s the quickest way to start with Agentica?**

A: Use the npx agentica@latest start wizard. It lets you pick a package-manager, choose a template and add pre-built controllers in one pass.

### Q: **What types of projects can I create?**

A: 
- **NodeJS Agent Server**
- **NestJS Agent Server**
- **React Client Application**
- **Standalone Application**

### Q: **Does Agentica depend on other frameworks?**

A: No. Agentica uses **`@samchon/openapi`** for OpenAPI specification handling and **`typia`** for TypeScript type transformation, but it doesn't depend on other agent frameworks. This ensures a lean, fast, and flexible experience. 

### Q: **Is Agentica open-source?**

A: Yes, Agentica is open-source and available under the MIT License. It actively encourages community contributions and collaboration. 

### Q: **Who develops Agentica?**

A: Agentica is proudly developed and maintained by Wrtn Technologies, with the goal of empowering developers to build reliable and structured AI agents effortlessly. 

---

**Features and Capabilities**

### Q: **Can Agentica handle complex use cases?**

A: Yes. Agentica excels at handling complex real-world scenarios, as demonstrated by projects like the shopping backend with 289 API functions. It can manage enterprise-level chatbots and complex workflows without requiring you to create complicated agent graphs. If you'd like to see the scenario in action, you can check it out in the following playground.

https://wrtnlabs.io/agentica/playground/shopping/

### Q: **Can I use Agentica with different AI models?**

A: Yes, Agentica officially supports various language models including:

- OpenAI models (GPT-4o-mini, GPT-4, etc.)
- Meta's Llama models
- Anthropic's Claude models
- Google's Gemini models

Here's a simple example of how to configure Agentica with Meta's Llama model instead of OpenAI:

```
// Using OpenAI GPT
const gptAgent = new Agentica({
  model: "chatgpt",
  vendor: {
    model: "gpt-4o-mini",
    api: new OpenAI({
      apiKey: "********",
    }),
  },
  controllers: [/* your controllers */]
});

// Using Meta's Llama
const llamaAgent = new Agentica({
  model: "llama",// Specify the model type
  vendor: {
    model: "llama-3-70b-instruct",// Specify the specific model
    api: new OpenAI({// Still uses OpenAI SDK as connection interface
      apiKey: "********",
      baseURL: "https://your-llama-api-endpoint",// Point to your Llama API
    }),
  },
  controllers: [/* your controllers */]
});
```

When switching models, you need to:

1. Change the **`model`** parameter to match the LLM vendor (e.g., "chatgpt", "llama", "claude", "gemini")
2. Update the vendor configuration with the appropriate model name
3. Configure the API connection (may require different baseURL for non-OpenAI models)

Note that different models may have slightly different function calling capabilities and schema requirements, which Agentica handles automatically through its conversion system.

### Q: **What makes Agentica different from other frameworks?**

A: Agentica focuses on four developer-visible advantages you rarely get all at once elsewhere:

1. **Comments → Code, automatically**
    
    You document functions or paste an OpenAPI file—Agentica harvests that text at build time and turns it into an LLM tool-catalog. No extra JSON schemas, no “tool” subclasses, no duplicated docs.
    
2. **Two-step calls that slash errors**
    
    The LLM first *chooses* a function from the catalog, then a second, constrained call *fills the arguments*. Because intent and arguments are separated, hallucinated keys and bloated prompts disappear, cutting debug time and token use.
    
3. **Compiler-speed validation**
    
    Function payloads are checked by typia—a compile-time code-generator that benchmarks up to 20 000× faster than run-time JSON-Schema validators. Bad data is rejected before it touches your business logic.
    
4. **Built-in documentation benchmark**
    
    The @agentica/benchmark CLI fires synthetic chats at your agent and flags any case where the LLM picks the wrong tool, letting you fix gaps *before* shipping.
    

**Why it matters:**

Less boilerplate to write, fewer hallucinations to chase, instant type-safe guards, and a safety net that tells you when your docs aren’t good enough—all without pulling in a heavyweight dependency chain.

### Q: **How does Agentica handle function calling?**

A: Agentica uses a sophisticated orchestration system with multiple steps: initialize, select, call, and describe. This approach significantly improves function calling accuracy through a validation feedback strategy that can increase success rates from approximately 70% on first attempt to nearly 100% after feedback cycles. document-driven-development.

### Q: **Does Agentica support integration with external APIs?**

A: Absolutely! Agentica can integrate with external APIs through multiple types of function controllers:

- HTTP Controllers: Connect to REST APIs using Swagger/OpenAPI documentation
- Class Controllers: Use TypeScript classes as function sources
- MCP Controllers: Connect to Model Context Protocol systems

---

**Technical Features**

### Q: **What programming languages does Agentica support?**

A: Agentica is primarily TypeScript/JavaScript-based, designed for Node.js environments (version 18.18.0 or higher). It can be used in both backend and frontend applications. 

### Q: **How does Agentica improve function calling accuracy?**

A: Agentica uses a validation feedback strategy where:

1. The LLM attempts to generate function arguments
2. Agentica validates the arguments against expected types
3. If validation fails, detailed error information is sent back to the LLM
4. The LLM corrects the arguments based on the feedback
5. The process repeats until valid arguments are produced document-driven-development.

### Q: **Does Agentica support vector databases for semantic search?**

A: Yes, Agentica supports vector databases for semantic search through plugins like **`AgenticaOpenAIVectorStoreSelector`** and **`AgenticaPgVectorSelector`**, enabling document retrieval based on natural language queries. 

### Q: **Can I use Agentica with NestJS or React?**

A: Yes, Agentica provides CLI tools to set up projects with different frameworks including NestJS and React. You can create standalone applications or combined NestJS+React projects. 

### Q: **Does Agentica offer benchmarking tools?**

A: Yes, Agentica provides benchmarking tools through the **`@agentica/benchmark`** module, which helps you test and improve the quality of your AI agents, especially for function selection accuracy. 

### Q: How does Agentica handle Document-Driven Development (DDD)?

A: Agentica treats your JSDoc and schema comments as executable metadata and wires them straight into the runtime:

1. **JSDoc harvesting** – During build, it scans every exported function (or imported Swagger spec), pulls the natural-language description, types, and any @before / @after tags into a JSON manifest.
2. **Two-phase orchestration** – At run-time the LLM first chooses a function from those purpose lines; a second, constrained call fills in the arguments. Comments stay focused on *what* the function does, not *how* to call it.
3. **Dependency enforcement** – The scheduler automatically respects @before / @after tags, guaranteeing proper call order.
4. **Schema-aware hints** – Field-level comments on DTOs become JSON-Schema, so the engine can validate or auto-correct the LLM’s payloads.
5. **Documentation guardrails** – The @agentica/benchmark CLI fires synthetic chats at the agent and flags any case where the LLM picks the wrong tool.
6. **Proven scale** – This DDD flow powered an e-commerce agent with **289 API endpoints**, achieving a 100 % correct function-selection rate—no hand-drawn workflows needed.

In short, you evolve an Agentica agent by editing comments; the framework turns those docs into a live, validated tool-catalog for the LLM.

---

**Resources and Community**

### Q: **Where can I find real-world Agentica examples?**

A: You can find examples and tutorials on the Agentica website and GitHub repository. There are demonstrations for various use cases including shopping chatbots, file system operations, Notion integration, and vector store implementations. 

### Q: **How can I contribute to Agentica?**

A: Contributions are warmly welcomed! Check out the CONTRIBUTING.md file in the GitHub repository to get started. You can fork the repository, create your branch, implement your changes, and submit a pull request. 

### Q: **Where can I get help with Agentica?**

A: You can join the Agentica community on Discord for support and discussions. Additionally, comprehensive documentation is available on the [Agentica website](https://wrtnlabs.io/agentica/docs/).


## 💬 Community & Support

For support, questions, or to provide feedback, join our Discord community:

[![Discord](https://dcbadge.limes.pink/api/server/https://discord.gg/aMhRmzkqCx)](https://discord.gg/aMhRmzkqCx)

## ⚖️ License

Agentica is open-source and available under the [MIT License](https://github.com/wrtnlabs/agentica/blob/master/LICENSE).

<p align="center">
  <img src="https://github.com/user-attachments/assets/ecd0b82e-bfb7-4eb5-ae97-75be0cb22f10" alt="Wrtn Labs Logo" />
</p>
<div align="center">
  Agentica is maintained by <a href="https://wrtnlabs.io">Wrtn Technologies</a> &mdash; Empowering developers to transform TypeScript functions and OpenAPI specs into powerful AI agents.
</div>
