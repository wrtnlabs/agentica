import { FeedbackIcon } from "../_components/icons/Feedback";
import { SwaggerIcon } from "../_components/icons/Swagger";
import { TypescriptClassIcon } from "../_components/icons/TypescriptClass";
import { DeclarativeIcon } from "../_components/icons/grapic/Declarative";
import { RobustIcon } from "../_components/icons/grapic/RobustIcon";
import { StructuredIcon } from "../_components/icons/grapic/StructuredIcon";

export const FUNC_CALL_CODE = `import { Agentica } from "@agentica/core";
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
await agent.conversate("I wanna buy MacBook Pro");`;

export const FUNC_CALLS = [
  {
    icon: FeedbackIcon,
    title: "validation feedback",
    description:
      "LLM doesn’t always get function parameters right. With validation feedback, it learns from mistakes and improves accuracy. This ensures more reliable and successful function calls.",
  },
  {
    icon: SwaggerIcon,
    title: "swagger",
    description:
      "Just upload a Swagger document, and AI will handle API calls. It understands your backend and interacts with it automatically. No extra setup—just seamless AI-powered API execution.",
  },
  {
    icon: TypescriptClassIcon,
    title: "typescript class",
    description:
      "Turn your TypeScript classes into AI-powered tools. AI reads your class types and calls the right methods on its own. No extra coding—just connect and start using AI.",
  },
];

export const CORE_VALUES = [
  {
    icon: StructuredIcon,
    title: "STRUCTURED",
    description:
      "Provides a clear, organized approach to AI-driven function calls. Reduces complexity and keeps your codebase tidy.",
  },
  {
    icon: RobustIcon,
    title: "ROBUST",
    description:
      "Engineered to handle real-world edge cases with reliable validation. Ensures seamless error feedback for worry-free development.",
  },
  {
    icon: DeclarativeIcon,
    title: "DECLARATIVE",
    description:
      "Focus on your agent’s purpose, not the plumbing. No more repetitive code—just define your agent’s capabilities, and let AI handle everything else.",
  },
];
