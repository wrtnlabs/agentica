import { ILlmSchema } from "@samchon/openapi";

import { AgenticaOperation } from "../context/AgenticaOperation";
import { AgenticaOperationCollection } from "../context/AgenticaOperationCollection";
import { IAgenticaConfig } from "../structures/IAgenticaConfig";
import { IAgenticaController } from "../structures/IAgenticaController";
import { __map_take } from "./__map_take";

export namespace AgenticaOperationComposer {
  export const compose = <Model extends ILlmSchema.Model>(props: {
    controllers: IAgenticaController<Model>[];
    config?: IAgenticaConfig<Model> | undefined;
  }): AgenticaOperationCollection<Model> => {
    const unique: boolean =
      props.controllers.length === 1 ||
      (() => {
        const names: string[] = props.controllers
          .map((controller) =>
            controller.application.functions.map((func) => func.name),
          )
          .flat();
        return new Set(names).size === names.length;
      })();
    const naming = (func: string, ci: number) =>
      unique ? func : `_${ci}_${func}`;

    const array: AgenticaOperation<Model>[] = props.controllers
      .map((controller, ci) =>
        controller.protocol === "http"
          ? controller.application.functions.map(
              (func) =>
                ({
                  protocol: "http",
                  controller: controller,
                  function: func,
                  name: naming(func.name, ci),
                  toJSON: () => ({
                    protocol: "http",
                    controller: controller.name,
                    function: func.name,
                    name: naming(func.name, ci),
                  }),
                }) satisfies AgenticaOperation.Http<Model>,
            )
          : controller.application.functions.map(
              (func) =>
                ({
                  protocol: "class",
                  controller,
                  function: func,
                  name: naming(func.name, ci),
                  toJSON: () => ({
                    protocol: "class",
                    controller: controller.name,
                    function: func.name,
                    name: naming(func.name, ci),
                  }),
                }) satisfies AgenticaOperation.Class<Model>,
            ),
      )
      .flat();
    const divided: AgenticaOperation<Model>[][] | undefined =
      !!props.config?.capacity && array.length > props.config.capacity
        ? divideOperations({
            array,
            capacity: props.config.capacity,
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
  };

  const divideOperations = <Model extends ILlmSchema.Model>(props: {
    array: AgenticaOperation<Model>[];
    capacity: number;
  }): AgenticaOperation<Model>[][] => {
    const size: number = Math.ceil(props.array.length / props.capacity);
    const capacity: number = Math.ceil(props.array.length / size);
    const replica: AgenticaOperation<Model>[] = props.array.slice();
    return new Array(size).fill(0).map(() => replica.splice(0, capacity));
  };
}
