"use client";

import type { Agentica } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import "./AgenticaStandalone.scss";

import { AgenticaProvider } from "./provider/AgenticaProvider";
import { AgenticaChatMovie } from "./components/chat/ChatMovie";

export interface AgenticaStandaloneProps<Model extends ILlmSchema.Model> {
  agentica: Agentica<Model>;
}
export function AgenticaStandalone<Model extends ILlmSchema.Model>({ agentica }: AgenticaStandaloneProps<Model>) {
  return (
    <div className="agentica-standalone-wrapper">
      <div className="agentica-standalone-content">
        <AgenticaProvider agentica={agentica}>
          <AgenticaChatMovie />
        </AgenticaProvider>
      </div>
    </div>
  );
}
