----
title: Typia (20,000x faster validator) challenges to Agentic AI with TypeScript Compiler Skills
---

-

## Preface

<!-- eslint-skip -->

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

## LLM Function Calling

## Validation Feedback

## Multi Agent Orchestration
