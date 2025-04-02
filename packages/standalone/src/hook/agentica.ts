import { useContext } from "react";

import { AgenticaContext } from "../context/agentica";

export function useAgentica() {
  const context = useContext(AgenticaContext);
  if (context === null) {
    throw new Error("useAgentica must be used within a AgenticaProvider");
  }
  return context;
}
