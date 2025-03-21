---
title: Agentica > Tutorial > Google Docs Agents  
---

## Introduction  

Set up a **fully functional Google Docs Agent** powered by OpenAI's GPT model in no time—using the Agentica CLI.


## The Complete Google Docs Agent  

Launch the Agentica Setup Wizard with a single command:

```bash
npx agentica start google-docs-agent
```  

The wizard guides you through:
- Installing the required packages (e.g., agentica@0.12.14)
- Choosing your package manager and project type
- Selecting the **Google Docs** controller
- Entering your `OPENAI_API_KEY`

Once complete, Agentica automatically generates your code, creates a `.env` file, and installs all dependencies.

## Generated Code Overview

The generated Google Docs Agent code looks like this:

```typescript
import { Agentica } from "@agentica/core";
import typia from "typia";
import dotenv from "dotenv";
import { OpenAI } from "openai";

import { GoogleDocsService } from "@wrtnlabs/connector-google-docs";

dotenv.config();

export const agent = new Agentica({
  model: "chatgpt",
 vendor: {
    api: new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    }),
    model: "gpt-4o-mini",
  },
  controllers: [
    {
      name: "Google Docs Connector",
      protocol: "class",
      application: typia.llm.application<GoogleDocsService, "chatgpt">(),
      execute: new GoogleDocsService(),
    },
  ],
});

const main = async () => {
  console.log(await agent.conversate("What can you do?"));
};

main();
```  
This code instantly sets up your Google Docs Agent to interact with Google Docs using OpenAI’s GPT model.

## Google API Setup  

Before running the Google Docs Agent, you need to configure your Google API credentials.  

```env
OPENAI_API_KEY=your-openai-api-key
GOOGLE_DOCS_CLIENT_ID=your-google-docs-client-id
GOOGLE_DOCS_CLIENT_SECRET=your-google-docs-client-secret
GOOGLE_DOCS_REFRESH_TOKEN=your-google-docs-refresh-token 
```

To get these credentials:
1. **Create a Project in Google Cloud Console:**  
   - Enable the **Google Docs API**.
2. **Obtain Credentials:**  
   - Generate OAuth 2.0 credentials to get your Client ID, Client Secret, and Refresh Token.

## What This Does

Your Google Docs Agent will:
- **Process Google Docs Data:** Use the `GoogleDocsService` connector.
- **Leverage OpenAI's GPT Model:** For smart email interactions.
- **Maintain Type Safety:** With `typia`.
- **Securely Manage Credentials:** Using `dotenv`.

## Selecting Specific Functions  

You can restrict available functions using TypeScript’s `Pick` utility. For example, to expose only these functions:
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

This selective exposure makes your integration even more secure and maintainable.

## Available Functions

For a list of available functions in `GoogleDocsService`, check out the source code:  
👉 [wrtnlabs/connectors - GoogleDocsService.ts](https://github.com/wrtnlabs/connectors/blob/main/packages/google_docs/src/google_docs/GoogleDocsService.ts)  

Your AI-powered Gmail Agent is now ready for seamless document operation automation! 🚀
