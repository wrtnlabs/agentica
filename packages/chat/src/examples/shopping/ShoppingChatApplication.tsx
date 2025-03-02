import { Agentica } from "@agentica/core";
import {
  HttpLlm,
  IHttpConnection,
  IHttpLlmApplication,
  OpenApi,
} from "@samchon/openapi";
import OpenAI from "openai";
import { useEffect, useState } from "react";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

export const ShoppingChatApplication = (
  props: ShoppingChatApplication.IProps,
) => {
  const [application, setApplication] =
    useState<IHttpLlmApplication<"chatgpt"> | null>(null);
  useEffect(() => {
    (async () => {
      setApplication(
        HttpLlm.application({
          model: "chatgpt",
          document: OpenApi.convert(
            await fetch(
              "https://raw.githubusercontent.com/samchon/shopping-backend/refs/heads/master/packages/api/customer.swagger.json",
            ).then((r) => r.json()),
          ),
        }),
      );
    })().catch(console.error);
  }, []);
  if (application === null)
    return (
      <div>
        <h2>Loading Swagger document</h2>
        <hr />
        <p>Wait for a moment please.</p>
        <p>Loading Swagger document...</p>
      </div>
    );

  const agent: Agentica<"chatgpt"> = new Agentica({
    model: "chatgpt",
    vendor: {
      api: props.api,
      model: "gpt-4o-mini",
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
  return <AgenticaChatApplication agent={agent} />;
};
export namespace ShoppingChatApplication {
  export interface IProps {
    api: OpenAI;
    connection: IHttpConnection;
    name: string;
    mobile: string;
    locale?: string;
  }
}
