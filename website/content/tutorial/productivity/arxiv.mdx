---
title: Agentica > Tutorial > Arxiv Search Agents  
---

## Introduction  

This tutorial will guide you through setting up a **fully functional Arxiv Search Agent** using **Agentica**. With just the following code, you’ll have an agent that can interact with Arxiv Search, powered by **OpenAI’s GPT model**.  

## The Complete Arxiv Search Agent  

First, install the required Arxiv Search connector package:  

```bash
npm install @wrtnlabs/connector-arxiv-search
```  

Then, simply add this code to your project:  

```typescript
import { Agentica } from "@agentica/core";
import { ArxivSearchService } from "@wrtnlabs/connector-arxiv-search";
import OpenAI from "openai";
import typia from "typia";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const ArxivSearchAgent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: openai,
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "Arxiv Search Connector",
      protocol: "class",
      application: typia.llm.application<ArxivSearchService, "chatgpt">(),
      execute: new ArxivSearchService({}),
    },
  ],
});
```  
## What This Does  

With this single setup, your Arxiv Search Agent is ready to:  

- **Process Arxiv Search data** using the `ArxivSearch` connector.  
- **Leverage OpenAI’s GPT model** for intelligent email interactions.  
- **Ensure type safety** with `typia`.  
- **Securely manage credentials** using `dotenv`.  

Just set up your **environment variables** in a `.env` file:  

```env
OPENAI_KEY=your-openai-api-key
```  

## Use Case Example

Imagine asking the agent:

> "Find papers related to AI Agent."

The Agent can search arxiv for papers related to AI Agents based on user-defined criteria.



## Available Functions  

For a list of available functions in `ArxivSearchService`, check out the source code:  
👉 [wrtnlabs/connectors - ArxivSearchService.ts](https://github.com/wrtnlabs/connectors/blob/main/packages/arxiv_search/src/arxiv_search/ArxivSearchService.ts)  

That’s it. This **single code block** gives you a fully functional ArxivSearch Agent, ready for AI-powered email automation. 🚀