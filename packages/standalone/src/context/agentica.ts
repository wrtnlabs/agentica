import { createContext } from "react";

import type { Agentica, IAgenticaEventJson } from "@agentica/core";

export interface AgenticaContextType {
  conversate: (content: string) => ReturnType<Agentica<any>["conversate"]>;
  messages: IAgenticaEventJson[];
  isError: boolean;
}

export const AgenticaContext = createContext<AgenticaContextType | null>(null);
