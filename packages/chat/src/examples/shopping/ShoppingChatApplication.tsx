import type {
  IHttpConnection,
  IHttpLlmApplication,
  ILlmSchema,
} from "@samchon/openapi";
import type OpenAI from "openai";

import { Agentica } from "@agentica/core";
import {
  HttpLlm,
  OpenApi,
} from "@samchon/openapi";
import { useEffect, useState } from "react";
import typia from "typia";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

export function ShoppingChatApplication(props: ShoppingChatApplication.IProps) {
  const [application, setApplication]
    = useState<IHttpLlmApplication<ILlmSchema.Model> | null>(null);
  useEffect(() => {
    (async () => {
      setApplication(
        HttpLlm.application({
          model: props.schemaModel,
          document: OpenApi.convert(
            await fetch(
              "https://raw.githubusercontent.com/samchon/shopping-backend/refs/heads/master/packages/api/customer.swagger.json",
            )
              .then(async r => r.json() as unknown)
              .then(v => typia.assert<Parameters<typeof OpenApi.convert>[0]>(v)),
          ),
        }),
      );
    })().catch(console.error);
  }, []);
  if (application === null) {
    return (
      <div>
        <h2>Loading Swagger document</h2>
        <hr />
        <p>Wait for a moment please.</p>
        <p>Loading Swagger document...</p>
      </div>
    );
  }

  const agent: Agentica<ILlmSchema.Model> = new Agentica({
    model: props.schemaModel,
    vendor: {
      api: props.api,
      model: props.vendorModel,
    },
    controllers: [
      {
        protocol: "http",
        name: "main",
        application,
        connection: props.connection,
      },
    ],
    config: {
      locale: props.locale,
    },
  });
  return (
    <AgenticaChatApplication agent={agent} title="Agentica Shopping Chatbot" />
  );
}
export namespace ShoppingChatApplication {
  export interface IProps {
    api: OpenAI;
    vendorModel: string;
    schemaModel: ILlmSchema.Model;
    connection: IHttpConnection;
    name: string;
    mobile: string;
    locale?: string;
  }
}
