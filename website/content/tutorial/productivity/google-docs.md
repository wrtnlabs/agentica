---
title: Agentica > Tutorial > Google Docs Agents  
---

## Introduction  

This tutorial will guide you through setting up a **fully functional Google Docs Agent** using **Agentica**. With just the following code, you’ll have an agent that can interact with Google Docs, powered by **OpenAI’s GPT model**.  

## The Complete Google Docs Agent  

First, install the required Google Docs connector package:  

```bash
npm install @wrtnlabs/connector-google-docs
```  

Then, simply add this code to your project:  

```typescript
import { Agentica } from "@agentica/core";
import { GoogleDocsService } from "@wrtnlabs/connector-google-docs";
import dotenv from "dotenv";
import OpenAI from "openai";
import typia from "typia";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export const GoogleDocsAgent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: openai,
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "Google Docs Connector",
      protocol: "class",
      application: typia.llm.application<GoogleDocsService, "chatgpt">(),
      execute: new GoogleDocsService({
        clientId: process.env.GOOGLE_DOCS_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_DOCS_CLIENT_SECRET!,
        secret: process.env.GOOGLE_DOCS_REFRESH_TOKEN!,
      }),
    },
  ],
});
```  

## Google API Setup  

Before running the Google Docs Agent, you need to configure your Google API credentials.  

1. **Create a Project in Google Cloud Console**  
   - Go to [Google Cloud Console - Google Docs API](https://console.cloud.google.com/marketplace/product/google/docs.googleapis.com?inv=1&invt=Absg_g).  
   - Create a new project and enable the **Google Docs API**.  

2. **Obtain Credentials**  
   - Generate OAuth 2.0 credentials to get your **Client ID** and **Client Secret**.  
   - Obtain a **Refresh Token** for persistent authentication.  

3. **Set Up Environment Variables**  
   - Add the following credentials to your `.env` file:  

   ```env
    GOOGLE_DOCS_CLIENT_ID=your-google-docs-client-id
    GOOGLE_DOCS_CLIENT_SECRET=your-google-docs-client-secret
    GOOGLE_DOCS_REFRESH_TOKEN=your-google-docs-refresh-token
   ```

   Once this setup is complete, your Google Docs Agent will be able to interact with Google Docs seamlessly.

## What This Does  

With this single setup, your Google Docs Agent is ready to:  

- **Process Google Docs data** using the `GoogleDocsService` connector.  
- **Leverage OpenAI’s GPT model** for intelligent document interactions.  
- **Ensure type safety** with `typia`.  
- **Securely manage credentials** using `dotenv`.  

Just set up your **environment variables** in a `.env` file:  

```env
OPENAI_KEY=your-openai-api-key
GOOGLE_DOCS_CLIENT_ID=your-google-docs-client-id
GOOGLE_DOCS_CLIENT_SECRET=your-google-docs-client-secret
GOOGLE_DOCS_REFRESH_TOKEN=your-google-docs-refresh-token
```  

## Selecting Specific Functions  

By using TypeScript’s `Pick` utility type, you can restrict the `GoogleDocsService` to only expose the methods you need.  

For example, in the following code, only these four functions are available:  

- `write`
- `clear`
- `readDocs`
- `update`

```typescript
export const GoogleDocsAgent = new Agentica({
  model: "chatgpt",
  vendor: {
    api: openai,
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "Google Docs Connector",
      protocol: "class",
      application: typia.llm.application<
        Pick<
          GoogleDocsService,
          | "write"
          | "clear"
          | "readDocs"
          | "update"
        >,
        "chatgpt"
      >(),
      execute: new GoogleDocsService({
        clientId: process.env.GOOGLE_DOCS_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_DOCS_CLIENT_SECRET!,
        secret: process.env.GOOGLE_DOCS_REFRESH_TOKEN!,
      }),
    },
  ],
});
```

This ensures that the `GoogleDocsAgent` only has access to these specific functions, making your integration more secure and maintainable.


## Available Functions  

For a list of available functions in `GoogleDocsService`, check out the source code:  
👉 [wrtnlabs/connectors - GoogleDocsService.ts](https://github.com/wrtnlabs/connectors/blob/main/packages/google_docs/src/google_docs/GoogleDocsService.ts)  

That’s it. This **single code block** gives you a fully functional GoogleDocs Agent, ready for AI-powered document operation automation. 🚀