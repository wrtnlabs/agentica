# Agentica Chat Application
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/agentica/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@agentica/chat.svg)](https://www.npmjs.com/package/@agentica/chat)
[![Downloads](https://img.shields.io/npm/dm/@agentica/chat.svg)](https://www.npmjs.com/package/@agentica/chat)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild)

A frontend application of Agentica chatbot for rapid demonstration.

This is not for final production, but just for demonstration. So please do not use this package globally. You have to utilize this package only for the internal demonstration.

```tsx
import { Agentica } from "@agentica/core";
import { AgenticaChatApplication } from "@agentica/chat";
import typia from "typia";

const agent = new Agentica({ ... });
ReactDOM.render(
  <AgenticaChatApplication agent={agent} />, 
  document.body,
);
```

> https://github.com/user-attachments/assets/01604b53-aca4-41cb-91aa-3faf63549ea6
>
> Demonstration video of Shopping AI Chatbot