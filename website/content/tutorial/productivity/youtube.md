---
title: Agentica > Tutorial > Youtube Agents  
---

## Introduction

This tutorial guides you through setting up a **Youtube Agent** using **Agentica**. With the code below, you can create an agent that interacts with Youtube powered by **OpenAI's GPT model**.

## The Complete Youtube Agent

First, install the required Youtube connector package:

```bash
npm install @wrtnlabs/connector-youbute-search
```

Then, simply add this code to your project:  

```typescript
import { Agentica } from "@agentica/core";
import { YoubuteSearchService } from "@wrtnlabs/connector-youbute-search";
import dotenv from "dotenv";
import OpenAI from "openai";
import typia from "typia";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const YoutubeAgent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: openai,
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "Youbute search Connector",
      protocol: "class",
      application: typia.llm.application<
        Pick<
          YoutubeSearchService,
          | "searchVideo"
          | "transcript"
        >,
        "chatgpt"
      >(),
      execute: new YoubuteSearchService({
        secret: process.env.YOUTUBE_API_KEY!,
      }),
    },
  ],
});
```

## Youtube API Setup
Before running the Youtube Agent, you need to configure your Google API credentials.  

1. **Create a Project in Google Cloud Console**  
   - Go to [Google Cloud Console - Youtube Data API v3](https://console.cloud.google.com/marketplace/product/google/youtube.googleapis.com?inv=1&invt=AbscKA&project=wrtn-copy).  
   - Create a new project and enable the **YouTube Data API v3**.  

2. **Set Up Environment Variables**  
   - Add the following credentials to your `.env` file:  

      ```env
      YOUTUBE_API_KEY=your-youtube-api-key
      ```

## What This Does

With this configuration, the Youtube Agent can:

- **Search for videos** Use `searchVideo` to retrieve search results for the search term you entered.
- **Get video subtitles** Use `transcript` to retrieve subtitles for a specific video.

Leveraging OpenAI's GPT model, the agent translates natural language queries into API calls, enabling seamless interaction with your Youtube workspace while ensuring type safety with `typia` and secure credential management with `dotenv`.

## Use Case Example

Imagine asking the agent:

> "Please search for videos related to AI Agent."

The agent summarizes the content, processes the natural language query, and then executes `searchVideo` to get videos related to AI Agent. Similarly, you can get subtitles for a specific searched video.

---



## Available Functions

You can review the full list of functions available in `YoutubeSearchService` by checking the source code.  
👉 [wrtnlabs/connectors - YoutubeSearchService.ts](https://github.com/wrtnlabs/connectors/blob/main/packages/youbute_search/src/youtube_search/YoutubeSearchService.ts)

With this **code block**, your AI-powered Youtube Agent is complete. 🚀

Enjoy harnessing the power of natural language interactions with your Youtube data!