import type { IHttpConnection, ILlmSchema } from "@samchon/openapi";
import type OpenAI from "openai";

import { Agentica } from "@agentica/core";
import {
  HttpLlm,
  OpenApi,
} from "@samchon/openapi";
import { Suspense, use } from "react";
import typia from "typia";

import { AgenticaChatApplication } from "../../AgenticaChatApplication";

function ShoppingChatApplicationSkeleton() {
  return (
    <div>
      <h2>Loading Swagger document</h2>
      <hr />
      <p>Wait for a moment please.</p>
      <p>Loading Swagger document...</p>
    </div>
  );
}

function AsyncAgenticaChatApplication({ agentPromise, title }: { agentPromise: Promise<Agentica<ILlmSchema.Model>>; title: string }) {
  const agent = use(agentPromise);
  return (
    <AgenticaChatApplication
      agent={agent}
      title={title}
    />
  );
}

export function ShoppingChatApplication(props: ShoppingChatApplication.IProps) {
  const getAgent = async () => {
    const application = HttpLlm.application({
      model: props.schemaModel,
      document: OpenApi.convert(
        await fetch(
          "https://raw.githubusercontent.com/samchon/shopping-backend/refs/heads/master/packages/api/customer.swagger.json",
        )
          .then(async r => r.json() as unknown)
          .then(v => typia.assert<Parameters<typeof OpenApi.convert>[0]>(v)),
      ),
    });
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
    return agent;
  };

  const agentPromise = getAgent();

  return (
    <Suspense fallback={<ShoppingChatApplicationSkeleton />}>
      <AsyncAgenticaChatApplication
        agentPromise={agentPromise}
        title="Agentica Shopping Chatbot"
      />
    </Suspense>
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
