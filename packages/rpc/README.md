# `@agentica/rpc`
![agentica-conceptual-diagram](https://github.com/user-attachments/assets/d7ebbd1f-04d3-4b0d-9e2a-234e29dd6c57)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/wrtnlabs/agentica/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@agentica/rpc.svg)](https://www.npmjs.com/package/@agentica/rpc)
[![Downloads](https://img.shields.io/npm/dm/@agentica/rpc.svg)](https://www.npmjs.com/package/@agentica/rpc)
[![Build Status](https://github.com/wrtnlabs/agentica/workflows/build/badge.svg)](https://github.com/wrtnlabs/agentica/actions?query=workflow%3Abuild)

RPC module of Agentica for WebSocket Communication

Agentica is the simplest Agentiic AI library specialized in **LLM Function Calling**, and `@agentica/rpc` is an RPC (Remote Procedure Call) wrapper module. If you combine the RPC wrapper module with [`TGrid`](https://github.com/samchon/tgrid), you can develop the WebSocket AI Chatbot.

```typescript
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketConnector } from "tgrid";

const connector: WebSocketConnector<
  null,
  IAgenticaRpcListener,
  IAgenticaRpcService
> = new WebSocketConnector(null, {
  text: async (evt) => {
    console.log(evt.role, evt.text);
  },
  describe: async (evt) => {
    console.log("describer", evt.text);
  },
});
await connector.connect("ws://localhost:3001");

const driver: Driver<IAgenticaRpcService> = connector.getDriver();
await driver.conversate("Hello, what you can do?");
```




## How to use
### Setup
```bash
# SERVER APPLICATION
npm install @agentica/core @agentica/rpc @samchon/openapi tgrid typia
npx typia setup

# CLIENT APPLICATION
npm install @agentica/core @agentica/rpc @samchon/openapi tgrid
```

Install `@agentica/rpc` with its dependent libraries.

Note that, you have to install not only `@agentica/core` and `@agentica/rpc`, but also [`@samchon/openapi`](https://github.com/samchon/openapi) and [`tgrid`](https://github.com/samchon/tgrid) too. If you're developing server application, you have to install `typia` too.

`@samchon/openapi` is an OpenAPI specification library which can convert Swagger/OpenAPI document to LLM function calling schema. And `typia` is a transformer (compiler) library which can compose LLM function calling schema from a TypeScript class type. And then `tgrid` is an RPC (REmote Procedure Call) framework supporting the websocket protocol.

By the way, as `typia` is a transformer library analyzing TypeScript source code in the compilation level, it needs additional setup command `npx typia setup` when developing server application. Also, if your client (frontend) application is not using the standard TypeScript compiler (not `tsc`), you have to setup [`@ryoppippi/unplugin-typia`](https://typia.io/docs/setup/#unplugin-typia) too.

### Server Application
```typescript
import { Agentica } from "@agentica/core";
import {
  AgenticaRpcService,
  IAgenticaRpcListener,
  IAgenticaRpcService,
} from "@agentica/rpc";
import { WebSocketServer } from "tgrid";

const server: WebSocketServer<
  null,
  IAgenticaRpcService,
  IAgenticaRpcListener
> = new WebSocketServer();
await server.open(3001, async (acceptor) => {
  await acceptor.accept(
    new AgenticaRpcService({
      agent: new Agentica({ ... }),
      listener: acceptor.getDriver(),
    }),
  );
});
```

When developing backend server, wrap `Agentica` to `AgenticaRpcService`.

If you're developing WebSocket protocol backend server, create a new `Agentica` instance, and wrap it to the `AgenticaRpcService` class. And then open the websocket server like above code. The WebSocket server will call the client functions of the `IAgenticaRpcListener` remotely.

### Client Application
```typescript
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketConnector } from "tgrid";

const connector: WebSocketConnector<
  null,
  IAgenticaRpcListener,
  IAgenticaRpcService
> = new WebSocketConnector(null, {
  text: async (evt) => {
    console.log(evt.role, evt.text);
  },
  describe: async (evt) => {
    console.log("describer", evt.text);
  },
});
await connector.connect("ws://localhost:3001");

const driver: Driver<IAgenticaRpcService> = connector.getDriver();
await driver.conversate("Hello, what you can do?");
```

When developing frontend application, define `IAgenticaRpcListener` instance.

Otherwise you're developing WebSocket protocol client application, connect to the websocket backend server with its URL address, and provide `IAgenticaRpcListener` instance for event listening.

And then call the backend server's function `IAgenticaRpcService.conversate()` remotely through the `Driver<IAgenticaRpcService>` wrapping. The backend server will call your `IAgenticaRpcListener` functions remotely through the RPC paradigm.




## NestJS Application
### Bootstrap
```bash
npx nestia start <directory>
cd <directory>
npm install @agentica/core @agentica/rpc @samchon/openapi tgrid
```

You can integrate `@agentica` with [NestJS Framework](https://nestjs.com) utilizing [Nestia](https://nestia.io).

At first, create a boilerplate project of NestJS combined with Nestia by running `npx nesta start` command. And then install `@agentica/rpc` with its dependency packages.

```typescript
import { WebSocketAcceptor } from "@nestia/core";
import { INestApplication } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { MyConfiguration } from "./MyConfiguration";
import { MyModule } from "./MyModule";

export class MyBackend {
  private application_?: INestApplication;

  public async open(): Promise<void> {
    //----
    // OPEN THE BACKEND SERVER
    //----
    // MOUNT CONTROLLERS
    this.application_ = await NestFactory.create(MyModule, { logger: false });
    WebSocketAcceptor.upgrade(this.application_);
    ...
  }
}
```

After setup, update `src/MyBackend.ts` file to call `WebSocketAdaptor.upgrade()` function to the NestJS application instance. The function `WebSocketAdaptor.upgrade()` will make the NestJS backend server to compatible with WebSocket protocol.

### API Controller
```typescript
import { AgenticaRpcService, IAgenticaRpcListener } from "@agentica/rpc";
import { WebSocketRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { WebSocketAcceptor } from "tgrid";

@Controller("chat")
export class ChatController {
  @WebSocketRoute()
  public async start(
    // @WebSocketRoute.Param("id") id: string,
    @WebSocketRoute.Acceptor()
    acceptor: WebSocketAcceptor<
      null, // header
      AgenticaRpcService,
      IAgenticaRpcListener
    >,
  ): Promise<void> {
    await acceptor.accept(
      new AgenticaRpcService({
        agent: new Agentica({ ... }),
        listener: acceptor.getDriver(),
      }),
    );
  }
}
```

Make a new NestJS controller class like above. 

When a client connects to the server with `ws://localhost:3001/chat` URL, Agentica made chatbot would be started in the WebSocket protocol.

If you need path or query parameters, utilize `@WebSocketRoute.Path()` or `@WebSocketRoute.Query()` decorator functions.

### Software Development Kit
```bash
npx nestia sdk
```

When backend server development has been completed, you can generate SDK (Software Development Kit) library for client developers by running `npx nestia sdk` command.

Client developers can utilize the SDK library like below.

```typescript
import { IAgenticaRpcListener } from "@agentica/rpc";
import api from "@ORGANIZATION/PROJECT-api";

const { connector, driver } = await api.functional.chat.start(
  {
    host: "http://localhost:3000",
  } satisfies api.IConnection,
  {
    text: async (evt) => {
      console.log(evt.role, evt.text);
    },
    describe: async (evt) => {
      console.log("describer", evt.text);
    },
  } satisfies IAgenticaRpcListener,
);
await driver.conversate("Hello, what you can do?");s
```




## Principles
### Remote Procedure Call
```mermaid
sequenceDiagram
box Client Application
  actor User
  participant Driver as Driver<Listener>
  participant Connector as Communicator (Client)
end
box Server Application
  participant Acceptor as Communicator (Server)
  actor Provider
end
User->>Driver: 1. calls a function
Activate User
Activate Driver
Driver->>Connector: 2. delivers the function call
Activate Connector
Deactivate Driver
Connector-->>Acceptor: 3. sends a protocolized<br/>network message<br/>meaning a function call
Deactivate Connector
Activate Acceptor
Acceptor->>Provider: 4. calls the function
Provider->>Acceptor: 5. returns a value
Acceptor-->>Connector: 6. sends a protocolized<br/>network message<br/>meaning a return value
Deactivate Acceptor
Activate Connector
Connector->>Driver: 7. delivers the return value
Deactivate Connector
Activate Driver
Driver->>User: 8. returns the value
Deactivate Driver
Deactivate User
```

WebSocket protocol with RPC paradigm for AI chatbot.

`@agentica/rpc` supports WebSocket protocol that is utilizing [`TGrid`](https://github.com/samchon/tgrid) and its RPC (Remote Procedure Call) paradigm for easy and type safe development. In the RPC paradigm, client application can call a function of `IAgenticaRpcService` remotely as if it were its own object.

Internally, the RPC has composed with three elements; [`Communicator`](https://tgrid.com/docs/features/components/#communicator), [`Provider`](https://tgrid.com/docs/features/components/#provider) and [`Driver`](https://tgrid.com/docs/features/components/#driver). The first `Communicator` takes a responsibility of (WebSocket) network communication. The next `Provider` means an object providing to the remote system for RPC, and `Driver` is a proxy instance realizing the RPC to the remote provided `Provider` instance.

For example, below client application code is calling `IAgenticaRpcService.conversate()` function remotely through the `Driver<IAgenticaRpcService>` typed instance. In that case, `IAgenticaRpcService` is the `Provider` instance from server to client. And `WebSocketConnector` is the communicator taking responsibility of WebSocket communication.

```typescript
import { IAgenticaRpcListener, IAgenticaRpcService } from "@agentica/rpc";
import { Driver, WebSocketConnector } from "tgrid";

const connector: WebSocketConnector<
  null,
  IAgenticaRpcListener,
  IAgenticaRpcService
> = new WebSocketConnector(null, {
  text: async (evt) => {
    console.log(evt.role, evt.text);
  },
  describe: async (evt) => {
    console.log("describer", evt.text);
  },
});
await connector.connect("ws://localhost:3001");

const driver: Driver<IAgenticaRpcService> = connector.getDriver();
await driver.conversate("Hello, what you can do?");
```