import type { ILlmSchema } from "@samchon/openapi";

import type { IAgenticaConfig } from "../../structures/IAgenticaConfig";
import type { IAgenticaController } from "../../structures/IAgenticaController";
import type { IMicroAgenticaConfig } from "../../structures/IMicroAgenticaConfig";
import type { AgenticaOperation } from "../AgenticaOperation";
import type { AgenticaOperationCollection } from "../AgenticaOperationCollection";

import { __map_take } from "../../utils/__map_take";

/**
 * Compose the agentica operation collection.
 *
 * Compose the {@link AgenticaOperationCollection} from the given
 * controllers and config.
 *
 * @internal
 */
export function compose<Model extends ILlmSchema.Model>(props: {
  controllers: IAgenticaController<Model>[];
  config?: IAgenticaConfig<Model> | IMicroAgenticaConfig<Model> | undefined;
}): AgenticaOperationCollection<Model> {
  const array: AgenticaOperation<Model>[] = getOperations({ controllers: props.controllers });
  const capacity: number | undefined = (props.config as IAgenticaConfig<Model>)?.capacity;
  const divided: AgenticaOperation<Model>[][] | undefined
      = capacity !== undefined && array.length > capacity
        ? divide({
            array,
            capacity,
          })
        : undefined;

  const flat: Map<string, AgenticaOperation<Model>> = new Map();
  const group: Map<string, Map<string, AgenticaOperation<Model>>> = new Map();
  for (const item of array) {
    flat.set(item.name, item);
    __map_take(group, item.controller.name, () => new Map()).set(
      item.name,
      item,
    );
  }
  return {
    array,
    divided,
    flat,
    group,
  };
}

const naming = (func: string, ci: number) => `_${ci}_${func}`;

/**
 * @internal
 */
export function getOperations<Model extends ILlmSchema.Model>(props: {
  controllers: IAgenticaController<Model>[];
}): AgenticaOperation<Model>[] {
  return props.controllers.flatMap((controller, idx) => {
    switch (controller.protocol) {
      case "http":{
        return toHttpOperations({ controller, index: idx }); }
      case "class":{
        return toClassOperations({ controller, index: idx }); }
      case "mcp": {
        return toMcpOperations({ controller, index: idx });
      }
      default:
        controller satisfies never;
        throw new Error(`Unsupported protocol: ${(controller as { protocol: string }).protocol}`);
    }
  });
}

/**
 * @internal
 */
export function toHttpOperations<Model extends ILlmSchema.Model>(props: {
  controller: IAgenticaController.IHttp<Model>;
  index: number;
}): AgenticaOperation<Model>[] {
  return props.controller.application.functions.map(func => ({
    protocol: "http",
    controller: props.controller,
    function: func,
    name: naming(func.name, props.index),
    toJSON: () => ({
      protocol: "http",
      controller: props.controller.name,
      function: func.name,
      name: naming(func.name, props.index),
    }),
  }));
}

/**
 * @internal
 */
export function toClassOperations<Model extends ILlmSchema.Model>(props: {
  controller: IAgenticaController.IClass<Model>;
  index: number;
}): AgenticaOperation<Model>[] {
  return props.controller.application.functions.map(func => ({
    protocol: "class",
    controller: props.controller,
    function: func,
    name: naming(func.name, props.index),
    toJSON: () => ({
      protocol: "class",
      controller: props.controller.name,
      function: func.name,
      name: naming(func.name, props.index),
    }),
  }));
}

/**
 * @internal
 */
export function toMcpOperations<Model extends ILlmSchema.Model>(props: {
  controller: IAgenticaController.IMcp;
  index: number;
}): AgenticaOperation<Model>[] {
  return props.controller.application.functions.map(func => ({
    protocol: "mcp",
    controller: props.controller,
    function: func,
    name: naming(func.name, props.index),
    toJSON: () => ({
      protocol: "mcp",
      controller: props.controller.name,
      function: func.name,
      name: naming(func.name, props.index),
    }),
  }));
}

/**
 * @internal
 */
export function divide<T>(props: {
  array: T[];
  capacity: number;
}): T[][] {
  if (props.capacity <= 0) {
    throw new Error("Capacity must be a positive integer");
  }
  if (Number.isNaN(props.capacity)) {
    throw new TypeError("Capacity must be a positive integer");
  }
  if (props.capacity === Infinity) {
    throw new Error("Capacity must be a positive integer");
  }

  const size: number = Math.ceil(props.array.length / props.capacity);
  const capacity: number = Math.ceil(props.array.length / size);
  const replica: T[] = props.array.slice();
  return Array.from({ length: size }, () => replica.splice(0, capacity));
}

export const AgenticaOperationComposer = {
  compose,
};
