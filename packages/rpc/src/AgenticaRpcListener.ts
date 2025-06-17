import type { AgenticaEvent, AgenticaOperationCollection, AgenticaOperationSelection } from "@agentica/core";
import type { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperationComposer, utils } from "@agentica/core";
import { Singleton } from "@agentica/core/src/utils/Singleton";

import type { IAgenticaRpcListener } from "./IAgenticaRpcListener";
import type { IAgenticaRpcService } from "./IAgenticaRpcService";

export class AgenticaRpcListener<Model extends ILlmSchema.Model> {
  public constructor(
    private readonly service: IAgenticaRpcService<Model>,
  ) {}

  public getListeneer(): IAgenticaRpcListener {
    return this.listener_;
  }

  public on<Type extends AgenticaEvent.Type>(
    type: Type,
    listener: (
      event: AgenticaEvent.Mapper<Model>[Type],
    ) => void | Promise<void>,
  ): this {
    utils.__map_take(
      this.events_,
      type,
      () => new Set(),
    ).add(listener as (event: AgenticaEvent<Model>) => void | Promise<void>);
    return this;
  }

  public off() {}

  private events_: Map<string, Set<(event: AgenticaEvent<Model>) => void | Promise<void>>> = new Map();
  private operations_ = new Singleton(
    async (): Promise<AgenticaOperationCollection<Model>> => {
      const controllers = await this.service.getControllers();
      return AgenticaOperationComposer.compose({
        controllers,
      });
    },
  );

  private listener_: IAgenticaRpcListener = {};
}
