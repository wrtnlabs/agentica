import { useCallback, useState } from "react";

import type { Agentica, IAgenticaEventJson } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { AgenticaContext } from "../context/agentica";

export function AgenticaProvider<Model extends ILlmSchema.Model>({ children, agentica }: { children: React.ReactNode; agentica: Agentica<Model> }) {
  const [messages, setMessages] = useState<IAgenticaEventJson[]>([]);
  const [isError, setIsError] = useState(false);

  const pushMessage = useCallback(
    async (message: IAgenticaEventJson) =>
      setMessages(prev => [...prev, message]),
    [],
  );

  agentica.on("describe", async (v) => {
    await pushMessage(v.toJSON());
  });
  agentica.on("text", async (v) => {
    await pushMessage(v.toJSON());
  });

  return (
    // intended because if changed agentica object address, the context value will be changed
    // eslint-disable-next-line react/no-unstable-context-value
    <AgenticaContext.Provider value={{ conversate: async v => agentica.conversate(v).catch((e) => {
      setIsError(true);
      console.error(e);
      throw e;
    }), messages, isError }}
    >
      {children}
    </AgenticaContext.Provider>
  );
}
